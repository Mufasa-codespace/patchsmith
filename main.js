(function () {
  var reduce = document.documentElement.classList.contains("reduce");
  var header = document.getElementById("site-header");
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var toTop = document.querySelector(".to-top");

  function scrollToEl(el) {
    if (!el) return;
    var offset = -8;
    if (!reduce && window.lenis) {
      window.lenis.scrollTo(el, { offset: offset });
      return;
    }
    var top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (mobileNav && !mobileNav.hidden) closeMenu();
      scrollToEl(el);
    });
  });

  function setHeaderTheme(theme) {
    header.classList.toggle("is-dark", theme !== "light");
    header.classList.toggle("is-light", theme === "light");
    var brandLogo = document.getElementById("brand-logo");
    if (!brandLogo) return;
    var src = theme === "light"
      ? "assets/brand/logo-primary-light.svg"
      : "assets/brand/logo-primary-dark.svg";
    if (brandLogo.getAttribute("src") !== src) brandLogo.setAttribute("src", src);
  }

  function onScroll() {
    header.classList.toggle("is-frosted", window.scrollY > 12);
    if (toTop) toTop.hidden = window.scrollY < 700;
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var zones = document.querySelectorAll("[data-header]");
  function updateTheme() {
    if (document.body.classList.contains("nav-open")) {
      setHeaderTheme("dark");
      return;
    }
    var y = window.scrollY + Math.min(header.offsetHeight, 80);
    var theme = "dark";
    zones.forEach(function (z) {
      var top = z.getBoundingClientRect().top + window.scrollY;
      if (y >= top && y < top + z.offsetHeight) theme = z.getAttribute("data-header");
    });
    setHeaderTheme(theme);
  }
  updateTheme();
  window.addEventListener("scroll", updateTheme, { passive: true });

  var fanQuery = window.matchMedia("(min-width: 900px)");
  function syncFanAccess() {
    var stacked = fanQuery.matches;
    var cards = document.querySelectorAll(".fan-card");
    cards.forEach(function (card, i) {
      var hide = stacked && i < cards.length - 1;
      if (hide) card.setAttribute("aria-hidden", "true");
      else card.removeAttribute("aria-hidden");
      if ("inert" in card) card.inert = hide;
    });
    var alt = document.getElementById("fan-alt");
    if (alt) {
      if (stacked) alt.removeAttribute("aria-hidden");
      else alt.setAttribute("aria-hidden", "true");
    }
  }
  syncFanAccess();
  if (fanQuery.addEventListener) fanQuery.addEventListener("change", syncFanAccess);

  function closeMenu() {
    if (!mobileNav || !toggle) return;
    mobileNav.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
    if (window.lenis) window.lenis.start();
  }
  function openMenu() {
    mobileNav.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("nav-open");
    if (window.lenis) window.lenis.stop();
    var first = mobileNav.querySelector("a");
    if (first) first.focus();
  }
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") closeMenu();
      else openMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        toggle.focus();
      }
    });
  }

  if (toTop) {
    toTop.addEventListener("click", function () {
      var top = document.getElementById("top");
      scrollToEl(top || document.body);
    });
  }

  document.querySelectorAll(".faq details").forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      document.querySelectorAll(".faq details").forEach(function (other) {
        if (other !== d) other.open = false;
      });
    });
  });

  document.querySelectorAll(".filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var kind = btn.getAttribute("data-filter");
      document.querySelectorAll(".filters button").forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      document.querySelectorAll(".sticker").forEach(function (s) {
        var show = kind === "all" || s.getAttribute("data-kind") === kind;
        s.classList.toggle("is-out", !show);
      });
    });
  });

  var fileInput = document.querySelector('input[name="artwork"]');
  var fileName = document.querySelector("[data-file-name]");
  if (fileInput && fileName) {
    fileInput.addEventListener("change", function () {
      var f = fileInput.files && fileInput.files[0];
      fileName.textContent = f ? f.name : "Vector or a clear PNG / JPG";
    });
  }

  var form = document.getElementById("quote-form");
  var status = document.getElementById("form-status");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // TODO: post this brief to the production endpoint once a URL exists.
      // Do not send the form anywhere yet. Artwork stays in the browser.
      var name = form.elements.name;
      var email = form.elements.email;
      var ok = true;
      [name, email].forEach(function (field) {
        var bad = !field.value.trim() || (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()));
        field.setAttribute("aria-invalid", bad ? "true" : "false");
        if (bad) ok = false;
      });
      if (!ok) {
        status.className = "form-status is-on";
        status.textContent = "Add your name and a real email so we know who the brief belongs to. Nothing was sent.";
        return;
      }
      status.className = "form-status is-on";
      status.textContent = "Nothing was sent. Keep a copy of what you typed.";
    });
  }

  if (!reduce && window.Lenis) {
    var lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 });
    window.lenis = lenis;
    if (window.ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
    if (window.gsap) {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }
  }

  function splitChars(el) {
    var text = el.textContent;
    var stroke = el.hasAttribute("data-stroke");
    el.textContent = "";
    var frag = document.createDocumentFragment();
    Array.from(text).forEach(function (ch) {
      var s = document.createElement("span");
      s.className = stroke ? "char is-stroke" : "char";
      s.textContent = ch === " " ? "\u00A0" : ch;
      frag.appendChild(s);
    });
    el.appendChild(frag);
    return el.querySelectorAll(".char");
  }

  function bootMotion() {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();

    document.querySelectorAll("[data-split]").forEach(function (row) {
      var chars = splitChars(row);
      gsap.set(chars, {
        x: function () { return gsap.utils.random(-260, 260); },
        y: function () { return gsap.utils.random(-180, 200); },
        rotation: function () { return gsap.utils.random(-80, 80); },
        opacity: 0.85
      });
    });

    mm.add("(min-width: 900px)", function () {
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#assemble",
          start: "top top",
          end: "+=130%",
          pin: true,
          scrub: 0.65,
          anticipatePin: 1
        }
      });
      tl.to(".assemble .char", {
        x: 0, y: 0, rotation: 0, opacity: 1,
        stagger: 0.012, ease: "power3.out"
      }, 0);
      tl.fromTo(".assemble__note", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.35 }, 0.55);
    });

    mm.add("(max-width: 899px)", function () {
      gsap.to(".assemble .char", {
        x: 0, y: 0, rotation: 0, opacity: 1,
        stagger: 0.008, ease: "power2.out",
        scrollTrigger: { trigger: "#assemble", start: "top 75%", end: "top 35%", scrub: 0.5 }
      });
    });

    gsap.to(".doodle path", {
      strokeDashoffset: -160,
      duration: 6,
      repeat: -1,
      ease: "none"
    });

    mm.add("(min-width: 900px)", function () {
      var cards = gsap.utils.toArray(".fan-card");
      gsap.fromTo(cards, {
        y: 120,
        rotation: 0
      }, {
        y: function (i) { return [22, 8, 0, 8, 22][i] || 0; },
        rotation: function (i) { return parseFloat(cards[i].getAttribute("data-rot")) || 0; },
        stagger: 0.05,
        ease: "power2.out",
        transformOrigin: "50% 120%",
        scrollTrigger: { trigger: ".fan", start: "top 80%", end: "top 30%", scrub: 0.7 }
      });
    });

    mm.add("(min-width: 900px)", function () {
      var cards = gsap.utils.toArray(".glass-card");
      if (cards.length < 2) return;
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".why",
          start: "top top",
          end: "+=" + (cards.length * 42) + "%",
          pin: true,
          scrub: 0.55,
          anticipatePin: 1
        }
      });
      cards.forEach(function (card, i) {
        if (i === 0) return;
        tl.to(cards[i - 1], { opacity: 0, y: -24, duration: 0.35 }, i);
        tl.fromTo(card, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.45 }, i);
      });
    });

    gsap.utils.toArray(".timeline li").forEach(function (item) {
      gsap.from(item, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 88%" }
      });
    });

    gsap.utils.toArray("main section:not(.assemble) h2, .footer-display").forEach(function (heading) {
      gsap.from(heading, {
        y: 42,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 90%" }
      });
    });

    gsap.utils.toArray(".sticker").forEach(function (fig) {
      gsap.from(fig, {
        y: 50,
        scale: 0.94,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        transformOrigin: "50% 60%",
        scrollTrigger: { trigger: fig, start: "top 92%" }
      });
    });

    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  bootMotion();

  function initRing() {
    if (reduce || window.innerWidth < 900) return;
    var canvas = document.getElementById("why-ring");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var dots = [];
    for (var i = 0; i < 70; i++) {
      dots.push({
        a: (i / 70) * Math.PI * 2,
        len: 0.05 + (i % 4) * 0.018,
        speed: 0.12 + (i % 5) * 0.03,
        color: i % 5 === 0 ? "#E07A2E" : "rgba(247,247,242,0.75)"
      });
    }
    var running = true;
    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
    }
    resize();
    window.addEventListener("resize", resize);
    var obs = new IntersectionObserver(function (entries) {
      running = entries[0].isIntersecting;
    });
    obs.observe(canvas);
    function frame(t) {
      if (running) {
        var w = canvas.width;
        var h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = Math.max(2, w * 0.004);
        ctx.lineCap = "round";
        var cx = w / 2;
        var cy = h / 2;
        var rx = w * 0.42;
        var ry = h * 0.4;
        dots.forEach(function (d) {
          var a = d.a + t * 0.00012 * d.speed;
          ctx.strokeStyle = d.color;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
          ctx.lineTo(cx + Math.cos(a + d.len) * rx, cy + Math.sin(a + d.len) * ry);
          ctx.stroke();
        });
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  initRing();

  function loadThree() {
    if (reduce) return;
    if (window.matchMedia("(max-width: 799px)").matches) return;
    var canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    var script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    script.onload = function () { initHero(canvas); };
    script.onerror = function () {};
    document.body.appendChild(script);
  }

  function initHero(canvas) {
    if (!window.THREE) return;
    var THREE = window.THREE;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch (err) {
      return;
    }
    renderer.setClearColor(0x000000, 0);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    camera.position.set(0, 0.4, 16);
    var group = new THREE.Group();
    scene.add(group);

    function roundedRectPoints(w, h, r, count) {
      var pts = [];
      var hw = w / 2;
      var hh = h / 2;
      var nEdge = Math.max(8, Math.round(count * 0.2));
      var nArc = Math.max(6, Math.round(count * 0.05));
      function edge(x0, y0, x1, y1, n) {
        for (var i = 0; i < n; i++) {
          var t = i / n;
          pts.push(new THREE.Vector3(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 0));
        }
      }
      function arc(cx, cy, a0, a1, n) {
        for (var i = 0; i < n; i++) {
          var a = a0 + (a1 - a0) * (i / n);
          pts.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0));
        }
      }
      edge(-hw + r, hh, hw - r, hh, nEdge);
      arc(hw - r, hh - r, Math.PI / 2, 0, nArc);
      edge(hw, hh - r, hw, -hh + r, nEdge);
      arc(hw - r, -hh + r, 0, -Math.PI / 2, nArc);
      edge(hw - r, -hh, -hw + r, -hh, nEdge);
      arc(-hw + r, -hh + r, -Math.PI / 2, -Math.PI, nArc);
      edge(-hw, -hh + r, -hw, hh - r, nEdge);
      arc(-hw + r, hh - r, Math.PI, Math.PI / 2, nArc);
      return pts;
    }

    function dotTexture() {
      var c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      var g = c.getContext("2d");
      var grd = g.createRadialGradient(32, 32, 0, 32, 32, 30);
      grd.addColorStop(0, "rgba(255,255,255,1)");
      grd.addColorStop(0.45, "rgba(255,255,255,0.85)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 64, 64);
      var tex = new THREE.CanvasTexture(c);
      return tex;
    }

    function build() {
      var off = document.createElement("canvas");
      off.width = 760;
      off.height = 180;
      var ctx = off.getContext("2d", { willReadFrequently: true });
      ctx.clearRect(0, 0, off.width, off.height);
      ctx.fillStyle = "#fff";
      ctx.font = '400 104px "Archivo Black", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("PATCHSMITH", off.width / 2, off.height / 2 + 6);
      var img = ctx.getImageData(0, 0, off.width, off.height).data;
      var targets = [];
      var step = 2;
      var scale = 40;
      for (var y = 0; y < off.height; y += step) {
        for (var x = 0; x < off.width; x += step) {
          var alpha = img[(y * off.width + x) * 4 + 3];
          if (alpha > 140) {
            targets.push({
              x: (x - off.width / 2) / scale,
              y: (off.height / 2 - y) / scale + 1.15,
              z: (Math.random() - 0.5) * 0.15,
              orange: x > off.width * 0.47
            });
          }
        }
      }
      if (targets.length > 2400) {
        var trimmed = [];
        var stride = Math.ceil(targets.length / 2400);
        for (var i = 0; i < targets.length; i += stride) trimmed.push(targets[i]);
        targets = trimmed;
      }
      var count = targets.length;
      var positions = new Float32Array(count * 3);
      var colors = new Float32Array(count * 3);
      for (var p = 0; p < count; p++) {
        positions[p * 3] = (Math.random() - 0.5) * 28;
        positions[p * 3 + 1] = (Math.random() - 0.5) * 16;
        positions[p * 3 + 2] = (Math.random() - 0.5) * 8;
        if (targets[p].orange) {
          colors[p * 3] = 0.878; colors[p * 3 + 1] = 0.478; colors[p * 3 + 2] = 0.18;
        } else {
          colors[p * 3] = 0.97; colors[p * 3 + 1] = 0.96; colors[p * 3 + 2] = 0.93;
        }
      }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      var sprite = dotTexture();
      var mat = new THREE.PointsMaterial({
        size: 0.16,
        map: sprite,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      var points = new THREE.Points(geo, mat);
      group.add(points);

      function stitchPoints(w, h, radius, count, color, size) {
        var loopPts = roundedRectPoints(w, h, radius, count);
        var positions = new Float32Array(loopPts.length * 3);
        var colors = new Float32Array(loopPts.length * 3);
        loopPts.forEach(function (p, i) {
          positions[i * 3] = p.x;
          positions[i * 3 + 1] = p.y;
          positions[i * 3 + 2] = p.z;
          colors[i * 3] = color[0];
          colors[i * 3 + 1] = color[1];
          colors[i * 3 + 2] = color[2];
        });
        var loopGeo = new THREE.BufferGeometry();
        loopGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        loopGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        var loopMat = new THREE.PointsMaterial({
          size: size,
          map: sprite,
          vertexColors: true,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        var loop = new THREE.Points(loopGeo, loopMat);
        loop.position.y = 1.35;
        group.add(loop);
      }
      stitchPoints(17.2, 6.6, 1.35, 220, [0.878, 0.478, 0.18], 0.11);
      stitchPoints(15.6, 5.2, 1.05, 160, [0.97, 0.94, 0.88], 0.07);

      return { points: points, targets: targets, count: count };
    }

    var hero = document.querySelector(".hero");
    var visible = true;
    var started = false;
    var built = null;
    var lookX = 0;
    var lookY = 0;

    function resize() {
      var w = hero.clientWidth || window.innerWidth;
      var h = hero.clientHeight || window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);
    var vis = new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; });
    vis.observe(hero);
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      lookX = ((e.clientX - r.left) / r.width - 0.5) * 0.35;
      lookY = ((e.clientY - r.top) / r.height - 0.5) * 0.2;
    });

    var clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      if (!visible || !built) return;
      var t = clock.getElapsedTime();
      var pos = built.points.geometry.attributes.position;
      var ease = Math.min(0.08, 0.02 + t * 0.01);
      for (var i = 0; i < built.count; i++) {
        var tx = built.targets[i].x;
        var ty = built.targets[i].y + Math.sin(t * 0.8 + i * 0.15) * 0.03;
        var tz = built.targets[i].z;
        pos.setX(i, pos.getX(i) + (tx - pos.getX(i)) * ease);
        pos.setY(i, pos.getY(i) + (ty - pos.getY(i)) * ease);
        pos.setZ(i, pos.getZ(i) + (tz - pos.getZ(i)) * ease);
      }
      pos.needsUpdate = true;
      group.rotation.y += (lookX + Math.sin(t * 0.25) * 0.18 - group.rotation.y) * 0.04;
      group.rotation.x += (-lookY - group.rotation.x) * 0.04;
      renderer.render(scene, camera);
    }

    function start() {
      if (started) return;
      started = true;
      try {
        built = build();
      } catch (err) {
        return;
      }
      if (!built || !built.count) return;
      document.body.classList.add("has-webgl");
      animate();
    }

    var fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    Promise.race([
      fonts,
      new Promise(function (resolve) { setTimeout(resolve, 1600); })
    ]).then(start);
  }

  if ("requestIdleCallback" in window) requestIdleCallback(loadThree, { timeout: 1200 });
  else setTimeout(loadThree, 300);
})();
