/* ===== Data musik: tambah/ubah di sini (foto di folder img/) ===== */
const ALBUMS=[
 {t:"Merry Christmas, Please Don't Call",a:'Bleachers',img:'img/album1.jpg'},
 {t:"All Too Well (10 Minute Version)",a:'Taylor Swift',img:'img/album2.jpg'},
 {t:"About You",a:'The 1975',img:'img/album3.jpg'},
 {t:"Adore You",a:'Harry Styles',img:'img/album4.jpg'},
 {t:"See You Again", a: 'Tyler, The Creator (Ft. Kali Uchis)',img:'img/album5.jpg'},
 {t:"Earrings",a:'Malcolm Todd',img:'img/album6.jpg'}
];

/* ===== Loading ===== */
const bar=document.getElementById('bar'),pct=document.getElementById('pct');
let p=0;
const LOAD_MS=3200,t0=performance.now();
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
let shown=0;
(function tick(now){
  const t=Math.min(1,(now-t0)/LOAD_MS);
  p=ease(t)*100;
  shown+=(p-shown)*.25;
  bar.style.width=shown+'%';pct.textContent=String(Math.round(shown)).padStart(3,'0');
  if(t<1)requestAnimationFrame(tick);
  else{bar.style.width='100%';pct.textContent='100';setTimeout(finish,450)}
})(t0);
function finish(){
  const c=document.getElementById('curtain');
  c.classList.add('go');
  document.getElementById('loader').classList.add('done');
  document.body.classList.add('ready');
  setTimeout(()=>{document.body.classList.remove('is-loading');c.remove()},3900);
}
const cur=document.getElementById('curtain');
for(let i=0;i<8;i++){const s=document.createElement('i');s.style.setProperty('--i',i);cur.appendChild(s)}
document.querySelectorAll('.hero__name span').forEach((s,i)=>s.style.setProperty('--n',i));

/* ===== About ===== */
const at=document.getElementById('aboutText'),ap=document.getElementById('aboutPhoto');
at.querySelectorAll('.l').forEach((e,i)=>e.style.setProperty('--d',i));
new IntersectionObserver((en,o)=>{if(en[0].isIntersecting){
  at.classList.add('in');o.disconnect();
  const n=at.querySelectorAll('.l').length;
  setTimeout(()=>ap.classList.add('in'),n*250+800);
}},{threshold:.3}).observe(at);

/* ===== Music: looping strip ===== */
const strip=document.getElementById('strip'),track=document.getElementById('stripTrack'),lb=document.getElementById('lightbox');
const SETS=4;
for(let s=0;s<SETS;s++)ALBUMS.forEach(al=>{
  const d=document.createElement('div');d.className='card';
  d.innerHTML=`<div class="card__img"><img src="${al.img}" alt="${al.t}"></div><b>${al.t}</b><small>${al.a}</small>`;
  d.dataset.t=al.t;d.dataset.a=al.a;d.dataset.img=al.img;track.appendChild(d);
});
let pos=0,setW=1,speed=0.7,target=0.7,dir=-1,drag=false,moved=0,lx=0,boost=0,lastY=scrollY;
const measure=()=>{setW=(track.scrollWidth/SETS)||1}; /* ||1: aman walau halaman Music sedang tersembunyi */
addEventListener('load',measure);addEventListener('resize',measure);measure();
(function loop(){
  const dy=Math.abs(scrollY-lastY);lastY=scrollY;boost+= (Math.min(dy,60)*.35-boost)*.1;
  speed+=(target-speed)*.08;
  if(!drag)pos+=dir*(speed+boost);
  pos=((pos%setW)+setW)%setW;
  track.style.transform=`translate3d(${-(setW+pos)}px,0,0)`;
  requestAnimationFrame(loop);
})();
strip.addEventListener('pointerdown',e=>{drag=true;moved=0;lx=e.clientX});
addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lx;lx=e.clientX;moved+=Math.abs(dx);pos-=dx});
addEventListener('pointerup',()=>{drag=false});
strip.addEventListener('wheel',e=>{const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:(e.shiftKey?e.deltaY:0);if(d){e.preventDefault();pos+=d}},{passive:false});
track.addEventListener('pointerover',e=>{const c=e.target.closest('.card');if(!c||drag)return;
  track.querySelectorAll('.card.on').forEach(x=>x.classList.remove('on'));c.classList.add('on');strip.classList.add('focus');target=0});
strip.addEventListener('pointerleave',()=>{strip.classList.remove('focus');track.querySelectorAll('.card.on').forEach(x=>x.classList.remove('on'));target=.7});

/* klik -> seluruh halaman blur, hanya foto terpilih */
let clone=null;
track.addEventListener('click',e=>{
  const c=e.target.closest('.card');if(!c||moved>6)return;
  const r=c.querySelector('img').getBoundingClientRect();
  clone=document.createElement('img');clone.src=c.dataset.img;
  Object.assign(clone.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});
  lb.prepend(clone);document.getElementById('lbCap').innerHTML=`${c.dataset.t}<small>${c.dataset.a}</small>`;
  lb.classList.add('open');
  const s=Math.min(innerWidth*.8,innerHeight*.62,640);
  requestAnimationFrame(()=>requestAnimationFrame(()=>Object.assign(clone.style,{width:s+'px',height:s+'px',left:(innerWidth-s)/2+'px',top:(innerHeight-s)/2-innerHeight*.05+'px'})));
});
function closeLb(){lb.classList.remove('open');if(clone){const x=clone;x.style.opacity=0;setTimeout(()=>x.remove(),500);clone=null}}
lb.addEventListener('click',closeLb);addEventListener('keydown',e=>e.key==='Escape'&&closeLb());

/* ===== Contact ===== */
const cg=document.getElementById('contactGrid');
cg.querySelectorAll('.ct').forEach((e,i)=>e.style.setProperty('--d',i));
new IntersectionObserver((en,o)=>{if(en[0].isIntersecting){cg.classList.add('in');o.disconnect()}},{threshold:.35}).observe(cg);


/* ===== Interaktif tambahan ===== */
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

/* progress bar scroll */
const sp=document.createElement('div');sp.className='sprog';document.body.appendChild(sp);
addEventListener('scroll',()=>{
  const m=document.documentElement.scrollHeight-innerHeight;
  sp.style.transform=`scaleX(${m>0?scrollY/m:0})`;
},{passive:true});

/* reveal saat scroll */
const rvIO=new IntersectionObserver(en=>en.forEach(x=>{if(x.isIntersecting){x.target.classList.add('rv-in');rvIO.unobserve(x.target)}}),{threshold:.2});
document.querySelectorAll('.tag,.music__title,.contact__title,.skills__title,.skills__lead,.journey__title,.journey__lead,footer').forEach(e=>{e.classList.add('rv');rvIO.observe(e)});

if(fine){
  /* parallax hero + magnetic kontak (dihaluskan dengan lerp) */
  const hero=document.getElementById('beranda'),hp=document.querySelector('.hero__photo'),hs=document.querySelector('.hero__script'),hb=document.querySelector('.hero__brand');
  let nx=0,ny=0,cx=0,cy=0;
  hero.addEventListener('pointermove',e=>{nx=e.clientX/innerWidth-.5;ny=e.clientY/innerHeight-.5});
  hero.addEventListener('pointerleave',()=>{nx=0;ny=0});
  const mags=[...document.querySelectorAll('.ct')].map(el=>({el,x:0,y:0,tx:0,ty:0}));
  mags.forEach(m=>{
    m.el.addEventListener('pointermove',e=>{const r=m.el.getBoundingClientRect();m.tx=(e.clientX-r.left-r.width/2)*.18;m.ty=(e.clientY-r.top-r.height/2)*.18});
    m.el.addEventListener('pointerleave',()=>{m.tx=0;m.ty=0});
  });
  (function fx(){
    cx+=(nx-cx)*.07;cy+=(ny-cy)*.07;
    hp.style.translate=`${cx*-26}px ${cy*-12}px`;
    hs.style.translate=`${cx*40}px ${cy*20}px`;
    hb.style.translate=`${cx*14}px ${cy*8}px`;
    mags.forEach(m=>{m.x+=(m.tx-m.x)*.15;m.y+=(m.ty-m.y)*.15;m.el.style.translate=`${m.x}px ${m.y}px`});
    requestAnimationFrame(fx);
  })();

  /* tilt 3D pada kartu musik */
  track.addEventListener('pointermove',e=>{
    const c=e.target.closest('.card');if(!c||drag)return;
    const i=c.querySelector('.card__img'),r=i.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    i.style.transform=`perspective(700px) rotateY(${x*16}deg) rotateX(${-y*16}deg)`;
  });
  track.addEventListener('pointerout',e=>{
    const c=e.target.closest('.card');if(c)c.querySelector('.card__img').style.transform='';
  });
}

/* foto about: miring mengikuti kursor */
ap.addEventListener('pointermove',e=>{
  const r=ap.getBoundingClientRect();
  ap.style.rotate=`${((e.clientX-r.left)/r.width-.5)*10}deg`;
});
ap.addEventListener('pointerleave',()=>{ap.style.rotate='0deg'});

/* ===== Skills: kartu muncul bergantian saat halaman dibuka ===== */
const sg=document.getElementById('skillsGrid');
new IntersectionObserver((en,o)=>{if(en[0].isIntersecting){sg.classList.add('in');o.disconnect()}},{threshold:.2}).observe(sg);

/* ===== My journey: panel interaktif (pilih tahap, tombol panah, putar otomatis) ===== */
(function(){
  const root=document.getElementById('jr');if(!root)return;
  const nodes=[...root.querySelectorAll('.jr__node')],items=nodes.map(n=>n.parentElement);
  const logos=[...root.querySelectorAll('.jr__logo')],txt=document.getElementById('jrTxt');
  const lvl=document.getElementById('jrLvl'),nm=document.getElementById('jrName'),ds=document.getElementById('jrAboutTxt'),ab=document.getElementById('jrAbout');
  const num=document.getElementById('jrNum'),cnt=document.getElementById('jrCur'),plate=document.getElementById('jrPlate');
  const n=nodes.length,pad=v=>String(v+1).padStart(2,'0');
  let cur=0,timer=null,stopped=false,hover=false,visible=false;

  function go(i){
    cur=(i+n)%n;
    nodes.forEach((b,k)=>{b.classList.toggle('is-on',k===cur);b.setAttribute('aria-selected',k===cur);b.tabIndex=k===cur?0:-1});
    items.forEach((li,k)=>li.classList.toggle('done',k<cur));
    logos.forEach((l,k)=>l.classList.toggle('is-on',k===cur));
    const d=nodes[cur].dataset;
    lvl.textContent=d.lvl;nm.textContent=d.name;ds.textContent=d.about;
    num.textContent=pad(cur);cnt.textContent=pad(cur);
    [txt,ab].forEach(e=>{e.classList.remove('swap');void e.offsetWidth;e.classList.add('swap')});
  }
  function user(i){stopped=true;go(i)}
  nodes.forEach((b,k)=>{
    b.addEventListener('click',()=>user(k));
    if(fine)b.addEventListener('pointerenter',()=>{if(cur!==k)user(k)});
  });
  document.getElementById('jrPrev').addEventListener('click',()=>user(cur-1));
  document.getElementById('jrNext').addEventListener('click',()=>user(cur+1));
  root.querySelector('.jr__rail').addEventListener('keydown',e=>{
    const f={ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1}[e.key];
    if(!f)return;e.preventDefault();user(cur+f);nodes[cur].focus();
  });

  /* putar otomatis saat terlihat; berhenti kalau pengunjung sudah memilih sendiri */
  function sync(){
    clearInterval(timer);
    if(visible&&!stopped&&!hover)timer=setInterval(()=>go(cur+1),4500);
  }
  root.addEventListener('pointerenter',()=>{hover=true;sync()});
  root.addEventListener('pointerleave',()=>{hover=false;sync()});
  new IntersectionObserver(en=>{
    visible=en[0].isIntersecting;
    if(visible)root.classList.add('in');
    sync();
  },{threshold:.3}).observe(root);

  go(0);
})();

/* ===== Skills: isi Modal Bootstrap sesuai kartu yang diklik ===== */
const skillModal=document.getElementById('skillModal');
if(skillModal)skillModal.addEventListener('show.bs.modal',e=>{
  const card=e.relatedTarget;if(!card)return;
  const d=card.dataset;
  document.getElementById('skillModalNo').textContent=card.querySelector('.sk__no').textContent+' — Skill';
  const img=document.getElementById('skillModalImg');img.src=d.img;img.alt='Logo '+d.name;
  document.getElementById('skillModalTitle').textContent=d.name;
  document.getElementById('skillModalText').textContent=d.detail;
  const box=document.getElementById('skillModalTags');box.textContent='';
  (d.tags||'').split(',').filter(Boolean).forEach(t=>{
    const s=document.createElement('span');s.className='badge rounded-0 sm__tag';s.textContent=t.trim();box.appendChild(s);
  });
});

/* ===== Navigasi halaman =====
   Home, About me, Skills, My journey, Music taste, Contact: satu halaman tampil sekali.
   Alamat di browser berubah jadi #home, #about, dst, jadi tombol Back/Forward juga berfungsi. */
(function(){
  const pages=[...document.querySelectorAll('.page')];
  const links=[...document.querySelectorAll('.topnav a[data-page]')];
  const keys=pages.map(p=>p.dataset.page);

  function show(key){
    if(!keys.includes(key))key='home';
    pages.forEach(p=>p.classList.toggle('active',p.dataset.page===key));
    links.forEach(a=>{
      if(a.dataset.page===key)a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    });
    scrollTo({top:0,behavior:'instant'});
    dispatchEvent(new Event('resize'));  /* hitung ulang ukuran strip musik */
    dispatchEvent(new Event('scroll'));  /* perbarui garis progres scroll */
  }
  addEventListener('hashchange',()=>{const k=location.hash.slice(1);if(k===''||keys.includes(k))show(k)}); /* alamat lain (mis. #skillModal) diabaikan */
  show(location.hash.slice(1));

  /* klik tab halaman yang sedang dibuka -> kembali ke atas halaman */
  links.forEach(a=>a.addEventListener('click',e=>{
    if(a.getAttribute('aria-current')==='page'){e.preventDefault();scrollTo({top:0,behavior:'smooth'})}
  }));
  /* tombol "Kembali ke atas" */
  document.querySelectorAll('[data-top]').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault();scrollTo({top:0,behavior:'smooth'});
  }));
})();

/* ===== Ganti tema gelap / terang (bulatan di navbar) ===== */
(function(){
  const root=document.documentElement,btn=document.getElementById('themeToggle');if(!btn)return;
  function sync(){
    const dark=root.getAttribute('data-theme')==='dark';
    btn.setAttribute('aria-pressed',dark);
    btn.setAttribute('aria-label',dark?'Ganti ke tema terang':'Ganti ke tema gelap');
  }
  btn.addEventListener('click',()=>{
    const dark=root.getAttribute('data-theme')!=='dark';
    root.classList.add('theme-anim');
    if(dark)root.setAttribute('data-theme','dark');else root.removeAttribute('data-theme');
    try{localStorage.setItem('theme',dark?'dark':'light')}catch(e){}
    sync();
    setTimeout(()=>root.classList.remove('theme-anim'),700);
  });
  sync();
})();