const $=(s,e=document)=>e.querySelector(s);
const ls=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const money=n=>'₹'+n.toLocaleString('en-IN');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const find=id=>PRODUCTS.find(p=>p.id==id);
let cart=ls('cart',{}),wish=ls('wish',[]);
const user=()=>ls('session',null);
const page=document.body.dataset.page;

function header(){
  const u=user();
  $('#hdr').innerHTML=`<a class="logo" href="index.html">VOLT<span>CART</span></a>
  <div class="search">${page==='home'?'<input id="q" type="search" placeholder="Search phones, laptops, audio..." aria-label="Search products">':''}</div>
  <nav><a href="index.html">Shop</a><a href="wishlist.html">♥ Wishlist<span class="badge" id="wc"></span></a>
  <a href="cart.html">🛒 Cart<span class="badge" id="cc"></span></a>
  ${u?`<a href="#" id="out">Hi, ${esc(u.name)} · Logout</a>`:'<a href="login.html">Login</a>'}</nav>`;
  if(u)$('#out').onclick=e=>{e.preventDefault();localStorage.removeItem('session');location.href='index.html'};
  badges();
}
function badges(){
  $('#cc').textContent=Object.values(cart).reduce((a,b)=>a+b,0)||'';
  $('#wc').textContent=wish.length||'';
}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)}
function addCart(id){cart[id]=(cart[id]||0)+1;save('cart',cart);badges();toast('Added to cart')}
function toggleWish(id){const i=wish.indexOf(id);i<0?wish.push(id):wish.splice(i,1);save('wish',wish);badges()}
const cartTotal=()=>Object.entries(cart).reduce((s,[id,q])=>s+find(id).price*q,0);

function card(p){
  return `<article class="card" data-id="${p.id}"><div class="pimg" style="--h:${p.id*47%360}">${p.icon}</div>
  <h3>${p.name}</h3><div class="rate">★ ${p.rate}</div>
  <div class="price">${money(p.price)}<s>${money(p.old)}</s></div>
  <div class="row"><button class="btn" data-act="add">Add to cart</button>
  <button class="heart ${wish.includes(p.id)?'on':''}" data-act="wish" aria-label="Wishlist">♥</button></div></article>`;
}
function tilt(root){
  root.querySelectorAll('.card').forEach(c=>{
    c.onmousemove=e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform=`rotateY(${x*14}deg) rotateX(${-y*14}deg) translateZ(8px)`};
    c.onmouseleave=()=>c.style.transform='';
  });
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const c=b.closest('[data-id]'),id=+c.dataset.id,a=b.dataset.act;
  if(a==='add'){addCart(id);c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop')}
  if(a==='wish'){toggleWish(id);b.classList.toggle('on');if(page==='wishlist')renderWish()}
  if(a==='inc'||a==='dec'||a==='del'){
    cart[id]=a==='inc'?cart[id]+1:a==='dec'?cart[id]-1:0;
    if(cart[id]<=0)delete cart[id];save('cart',cart);badges();renderCart();
  }
  if(a==='move'){addCart(id);toggleWish(id);renderWish()}
});

/* ---------- pages ---------- */
function home(){
  const cats=['All',...new Set(PRODUCTS.map(p=>p.cat))];let cat='All';
  $('#ring').innerHTML=PRODUCTS.slice(0,6).map((p,i)=>`<div class="face" style="--i:${i}">${p.icon}</div>`).join('');
  $('#chips').innerHTML=cats.map(c=>`<button class="chip ${c==='All'?'on':''}">${c}</button>`).join('');
  const draw=()=>{
    const q=$('#q').value.toLowerCase().trim();
    const list=PRODUCTS.filter(p=>(cat==='All'||p.cat===cat)&&p.name.toLowerCase().includes(q));
    $('#grid').innerHTML=list.map(card).join('')||'<p class="empty">No products match. Try another word or category.</p>';
    tilt($('#grid'));
  };
  $('#chips').onclick=e=>{if(!e.target.classList.contains('chip'))return;cat=e.target.textContent;
    document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c===e.target));draw()};
  $('#q').oninput=draw;draw();
}
function renderCart(){
  const ids=Object.keys(cart);
  $('#list').innerHTML=ids.length?ids.map(id=>{const p=find(id);return `<div class="item" data-id="${id}">
  <div class="pimg" style="--h:${id*47%360}">${p.icon}</div><div class="info"><h3>${p.name}</h3><div class="price">${money(p.price)}</div></div>
  <div class="qty"><button data-act="dec" aria-label="Less">−</button><b>${cart[id]}</b><button data-act="inc" aria-label="More">+</button></div>
  <button class="btn alt" data-act="del">Remove</button></div>`}).join(''):'<p class="empty">Your cart is empty. <a href="index.html" style="color:var(--neon)">Browse products</a></p>';
  $('#total').textContent=money(cartTotal());$('#go').style.display=ids.length?'':'none';
}
function renderWish(){
  const items=wish.map(find);
  $('#list').innerHTML=items.length?items.map(p=>`<div class="item" data-id="${p.id}"><div class="pimg" style="--h:${p.id*47%360}">${p.icon}</div>
  <div class="info"><h3>${p.name}</h3><div class="price">${money(p.price)}</div></div>
  <button class="btn" data-act="move">Move to cart</button><button class="btn alt" data-act="wish">Remove</button></div>`).join(''):'<p class="empty">No saved items yet. Tap ♥ on any product.</p>';
}
function loginPage(){
  let mode='in';const next=new URLSearchParams(location.search).get('next')||'index.html';
  const set=m=>{mode=m;$('#nm').style.display=m==='up'?'':'none';$('#sub').textContent=m==='up'?'Create account':'Login';
    $('#ti').classList.toggle('alt',m!=='in');$('#tu').classList.toggle('alt',m!=='up');$('#err').textContent=''};
  $('#ti').onclick=()=>set('in');$('#tu').onclick=()=>set('up');set('in');
  $('#f').onsubmit=e=>{e.preventDefault();
    const name=$('#name').value.trim(),email=$('#email').value.trim().toLowerCase(),pw=$('#pw').value,users=ls('users',[]);
    if(pw.length<6)return $('#err').textContent='Password must be at least 6 characters.';
    if(mode==='up'){
      if(!name)return $('#err').textContent='Please enter your name.';
      if(users.some(u=>u.email===email))return $('#err').textContent='This email is already registered. Log in instead.';
      users.push({name,email,pw});save('users',users);save('session',{name,email});location.href=next;
    }else{
      const u=users.find(u=>u.email===email&&u.pw===pw);
      if(!u)return $('#err').textContent='Email or password is wrong. New here? Sign up first.';
      save('session',{name:u.name,email});location.href=next;
    }};
}
function checkout(){
  if(!user()){location.href='login.html?next=checkout.html';return}
  if(!Object.keys(cart).length){location.href='cart.html';return}
  $('#sum').innerHTML=Object.entries(cart).map(([id,q])=>`<div><span>${find(id).name} × ${q}</span><span>${money(find(id).price*q)}</span></div>`).join('')
   +`<div><span>Delivery</span><span>Free</span></div><div class="total"><span>Total</span><span>${money(cartTotal())}</span></div>`;
  $('#cname').value=user().name;
  $('#f').onsubmit=e=>{e.preventDefault();
    const order={id:'VC'+Date.now().toString().slice(-8),name:$('#cname').value.trim(),phone:$('#phone').value,addr:$('#addr').value.trim(),
      pay:$('#pay').value,total:cartTotal(),items:Object.entries(cart).map(([id,q])=>({n:find(id).name,q,p:find(id).price})),date:new Date().toLocaleString('en-IN')};
    save('lastOrder',order);cart={};save('cart',cart);location.href='confirmation.html'};
}
function confirmPage(){
  const o=ls('lastOrder',null);
  if(!o){$('#box').innerHTML='<p class="empty">No recent order found.</p>';return}
  $('#box').innerHTML=`<div class="center"><div class="tick">✅</div><h1>Order placed!</h1><p style="color:var(--mut)">Thanks, ${esc(o.name)}. Your order <b style="color:var(--neon)">${o.id}</b> is confirmed.</p></div>
  <div class="box sum">${o.items.map(i=>`<div><span>${esc(i.n)} × ${i.q}</span><span>${money(i.p*i.q)}</span></div>`).join('')}
  <div class="total"><span>Total (${esc(o.pay)})</span><span>${money(o.total)}</span></div>
  <p style="color:var(--mut);margin-top:12px">Deliver to: ${esc(o.addr)} · ${esc(o.phone)}<br>Placed on ${o.date}</p></div>
  <p class="center"><a class="btn" href="index.html">Continue shopping</a></p>`;
}
header();
({home,cart:renderCart,wishlist:renderWish,login:loginPage,checkout,confirm:confirmPage})[page]?.();
