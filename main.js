const WA_NUMBER='';// TODO: add the WhatsApp number, e.g. '9715XXXXXXXX'
const waMsg=encodeURIComponent("Hi Patchsmith, I'd like a quote for custom patches.");
document.querySelectorAll('.js-wa').forEach(a=>{a.href=WA_NUMBER?`https://wa.me/${WA_NUMBER}?text=${waMsg}`:'#quote';a.target=WA_NUMBER?'_blank':''});
document.querySelector('.nav__toggle').onclick=e=>{const open=document.querySelector('.nav__links').classList.toggle('is-open');e.currentTarget.setAttribute('aria-expanded',open?'true':'false')};document.querySelectorAll('.nav__links a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('.nav__links').classList.remove('is-open');document.querySelector('.nav__toggle').setAttribute('aria-expanded','false')}));
const TYPES=[
{n:'Embroidered',d:'The classic. Raised, textured thread for logos that want to be felt.',m:[4,5,4],b:'Caps, jackets, uniforms',bg:'#2E4B3C',r:'28px'},
{n:'Woven',d:'Thinner thread, sharper detail. Small text and fine lines stay crisp.',m:[5,2,4],b:'Detailed logos, labels, fine text',bg:'repeating-linear-gradient(90deg,#2E4B3C 0 3px,#3b5d4b 3px 6px)',r:'12px'},
{n:'PVC',d:'Soft rubber, fully waterproof, practically indestructible.',m:[4,3,5],b:'Outdoor gear, tactical kit, bags',bg:'#E07A2E',r:'50%'},
{n:'Chenille',d:'Fuzzy, bold, unmistakably varsity.',m:[2,5,3],b:'Letterman jackets, schools, retro merch',bg:'radial-gradient(#f2b27c 20%,#E07A2E 21%)',r:'40% 40% 20% 20%'},
{n:'Leather',d:'Debossed or printed for a premium, grown-up finish.',m:[3,4,5],b:'Denim, hats, bags, premium labels',bg:'#7a4a2b',r:'16px'}];
const L=['Detail','Texture','Durability'],tabs=document.querySelector('.selector__tabs'),$=s=>document.querySelector(s);
function show(i){const t=TYPES[i];tabs.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-selected',i===j));
$('.selector__name').textContent=t.n;$('.selector__desc').textContent=t.d;$('.selector__best').textContent='Best for: '+t.b;
const sw=$('.selector__swatch');sw.style.background=t.bg;sw.style.borderRadius=t.r;
$('.selector__meters').innerHTML=t.m.map((v,k)=>`<li class="meter"><span>${L[k]}</span><span class="meter__bar"><span class="meter__fill" style="width:${v*20}%"></span></span></li>`).join('');}
TYPES.forEach((t,i)=>{const b=document.createElement('button');b.className='selector__tab';b.role='tab';b.textContent=t.n;b.onclick=()=>show(i);tabs.append(b)});show(0);
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('is-visible')),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.querySelector('.form').addEventListener('submit',e=>{e.preventDefault();const f=e.target,m=f.querySelector('.form__msg');
if(!f.name.value||!f.email.value.includes('@')){m.textContent='Add your name and a valid email, and we will take it from there.';return}
m.textContent='Got it. Your request is in. (Prototype: nothing was sent. Connect a form backend before launch.)';f.reset()});
