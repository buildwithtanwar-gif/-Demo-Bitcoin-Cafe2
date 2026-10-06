'use strict';
/* ===== EDIT HERE: menu data. Names come from the list you pasted. VERIFY before showing the owner. =====
   To add a photo/price for an item, add it to OVERRIDES below, e.g. 'Veg Steamed Momos': {img:'img/momo.jpg', price:'₹80'} */
const PHONE = '919217039700';
const OVERRIDES = {};
const MENU = {
  'Breakfast': ['Aloo Paratha','Paneer Paratha','Gobhi Paratha','Moong Dal Chilla','Missi Paratha'],
  'Starters': ['Chilli Paneer','Veg Manchurian','Chilli Potato','Honey Chilli Potato','Chilli Chicken','Chicken Manchurian','Crispy Honey Chicken','Lemon Chicken','Chicken Lollipop','Drums of Heaven'],
  'Soups': ['Veg Hot & Sour','Veg Manchow','Chicken Hot N Sour','Chicken Manchow'],
  'Rice & Noodles': ['Veg Classic Fried Rice','Veg Chilli Garlic Fried Rice','Veg Singapuri Fried Rice','Egg Fried Rice','Chicken Fried Rice','Veg Hakka Noodles','Egg Hakka Noodles','Chicken Hakka Noodles','Veg Chilli Garlic Noodles','Chicken Chilli Garlic Noodles','Singapuri Noodles'],
  'Pasta': ['Veg White Sauce Pasta','Veg Red Sauce Pasta','Veg Mixed Sauce Pasta','Chicken Red Sauce Pasta','Chicken Mixed Sauce Pasta','Chicken White Sauce Pasta'],
  'Burgers & Sandwiches': ['Veg Tikki Burger','Veg Spicy Paneer Burger','Veg Cheese Burger','Veg Cheese Paneer Burger','Chicken Burger','Chicken Seekh Burger','Crispy Chicken Burger','Shawarma Burger','Veg Grilled Sandwich','Chicken Grilled Sandwich'],
  'Snacks': ['French Fries','Peri Peri Fries','Crispy Corn','Chicken Nuggets','Chicken Strip','Masala Peanut','Egg Omelette','Half Fry'],
  'Momos': ['Veg Steamed Momos','Veg Fried Momos','Veg Chilli Momos','Veg Kurkure Momos','Veg Creamy Momos','Veg Afghani Momos','Paneer Momos','Chicken Steamed Momos','Chicken Fried Momos','Chicken Chilli Momos','Chicken Kurkure Momos'],
  'Rolls & Wraps': ['Paneer Roll','Chilli Paneer Roll','Egg Roll','Egg Chicken Roll','Chicken Roll','Chilli Chicken Roll','Lemon Chicken Roll','Aloo Tikki Roll','Paneer Shawarma Roll','Shawarma Paratha','Chicken Shawarma Roll','Veg Wrap','Paneer Wrap','Chicken Wrap'],
  'Drinks': ['Mango Shake','Banana Shake','Pineapple Shake','Strawberry Shake','Blueberry Shake','Vanilla Shake','Caramel Shake','KitKat Shake','Oreo Shake','Lemon Ice Tea','Mint Mojito','Lemonade','Jaljeera'],
  'Maggi': ['Plain Maggi','Veg Maggi','Egg Maggi','Chicken Maggi'],
  'Combos': ['Chilli Chicken + Rice','Chilli Paneer + Rice','Lemon Chicken + Rice','Rice + Veg Manchurian','Noodles + Chilli Chicken','Noodles + Chilli Paneer','Noodles + Veg Manchurian'],
  'Main Course': ['Dal Tadka','Dal Makhani','Shahi Paneer','Kadhai Paneer','Paneer Butter Masala','Matar Paneer','Mix Veg','Chicken Curry','Butter Chicken','Kadhai Chicken','Egg Curry','Plain Rice','Jeera Rice','Chicken Biryani']
};
const PICKS = ['Veg Steamed Momos','Chicken Roll','Veg Tikki Burger','Oreo Shake']; // variety picks, not claimed bestsellers
const ICON = {Breakfast:'🥞',Starters:'🍢',Soups:'🍲','Rice & Noodles':'🍜',Pasta:'🍝','Burgers & Sandwiches':'🍔',Snacks:'🍟',Momos:'🥟','Rolls & Wraps':'🌯',Drinks:'🥤',Maggi:'🍜',Combos:'🍱','Main Course':'🍛'};
/* veg/non-veg is inferred from the name only; unclear items show no indicator */
const NV = /chicken|egg|omelette|half fry|lollipop/i;
const VG = /veg|paneer|aloo|gobhi|moong|missi|dal |fries|corn|peanut|shake|mojito|lemonade|jaljeera|ice tea|plain/i;

const ITEMS = Object.entries(MENU).flatMap(([category, names]) => names.map(name => ({
  name, category, veg: NV.test(name) ? false : (VG.test(name) ? true : null), img: '', price: null, ...(OVERRIDES[name] || {})
})));
const $ = (s, el = document) => el.querySelector(s);
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ===== menu ===== */
let cat = 'All', q = '';
const cardHTML = i => `<article class="card"><div class="ph">${i.img ? `<img src="${esc(i.img)}" alt="${esc(i.name)}" loading="lazy">` : ICON[i.category]}</div>
  <div class="cb"><h3>${esc(i.name)}</h3><div class="meta">${i.veg === null ? '' : `<span class="dot ${i.veg ? 'v' : 'n'}" title="${i.veg ? 'Veg' : 'Non-veg'}"></span>`}${esc(i.category)} · ${i.price || 'Price on request'}</div>
  <button class="btn" data-add="${esc(i.name)}">ADD TO ORDER</button></div></article>`;
function renderMenu() {
  const list = ITEMS.filter(i => (cat === 'All' || i.category === cat) && i.name.toLowerCase().includes(q));
  $('#grid').innerHTML = list.length ? list.map(cardHTML).join('') : '<p class="empty">No dishes found. Try another search.</p>';
}
function renderTabs() {
  $('#tabs').innerHTML = ['All', ...Object.keys(MENU)].map(c => `<button role="tab" class="${c === cat ? 'on' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
}
$('#tabs').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) { cat = b.dataset.cat; renderTabs(); renderMenu(); } });
$('#search').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); renderMenu(); });
$('#picksGrid').innerHTML = PICKS.map(n => ITEMS.find(i => i.name === n)).filter(Boolean).map(cardHTML).join('');
renderTabs(); renderMenu();

/* ===== cart (no prices, so no totals) ===== */
const cart = new Map();
function renderCart() {
  const list = $('#cartList'); let n = 0, msg = [];
  list.innerHTML = '';
  cart.forEach((qty, name) => {
    n += qty; msg.push(`${qty} x ${name}`);
    list.insertAdjacentHTML('beforeend', `<li><span>${esc(name)}</span><button data-dec="${esc(name)}" aria-label="Less">−</button><b>${qty}</b><button data-inc="${esc(name)}" aria-label="More">+</button><button data-rm="${esc(name)}" aria-label="Remove ${esc(name)}">✕</button></li>`);
  });
  $('#count').textContent = n;
  $('#cartEmpty').hidden = n > 0;
  const text = n ? `Hi Bitcoin Cafe, I'd like to order:\n${msg.join('\n')}` : 'Hi Bitcoin Cafe, I want to place an order.';
  $('#wa').href = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
}
const setCart = (open) => { $('#drawer').classList.toggle('open', open); $('#scrim').classList.toggle('on', open); $('#drawer').setAttribute('aria-hidden', !open); };
document.addEventListener('click', e => {
  const t = e.target;
  const add = t.closest('[data-add]'), inc = t.closest('[data-inc]'), dec = t.closest('[data-dec]'), rm = t.closest('[data-rm]');
  if (add) { cart.set(add.dataset.add, (cart.get(add.dataset.add) || 0) + 1); renderCart(); setCart(true); }
  else if (inc) { cart.set(inc.dataset.inc, cart.get(inc.dataset.inc) + 1); renderCart(); }
  else if (dec) { const k = dec.dataset.dec, v = cart.get(k) - 1; v > 0 ? cart.set(k, v) : cart.delete(k); renderCart(); }
  else if (rm) { cart.delete(rm.dataset.rm); renderCart(); }
  else if (t.closest('[data-open-cart]')) setCart(true);
  else if (t.closest('#closeCart') || t.id === 'scrim') setCart(false);
});
renderCart();

/* ===== nav ===== */
const nav = $('#nav'), links = $('#menuLinks'), burger = $('#burger');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });
const toggleNav = open => { links.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
burger.addEventListener('click', () => toggleNav(!links.classList.contains('open')));
links.addEventListener('click', e => { if (e.target.tagName === 'A') toggleNav(false); });

/* ===== gallery + lightbox (placeholders: set src to real photo paths) ===== */
const GALLERY = [
  {e:'🥟',alt:'Momos (placeholder)',h:150},{e:'🍔',alt:'Burger (placeholder)',h:220},{e:'🌯',alt:'Roll (placeholder)',h:180},
  {e:'🥤',alt:'Shake (placeholder)',h:240},{e:'🍜',alt:'Noodles (placeholder)',h:170},{e:'🏠',alt:'Cafe exterior (placeholder)',h:200}
].map(g => ({ ...g, src: '' }));
$('#masonry').innerHTML = GALLERY.map((g, i) => `<button data-lb="${i}" style="height:${g.h}px" aria-label="Open ${esc(g.alt)}">${g.src ? `<img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy">` : g.e}</button>`).join('');
let cur = 0;
const lb = $('#lb');
function showLb(i) {
  cur = (i + GALLERY.length) % GALLERY.length;
  const g = GALLERY[cur];
  $('#lbImg').innerHTML = g.src ? `<img src="${esc(g.src)}" alt="${esc(g.alt)}">` : g.e;
}
$('#masonry').addEventListener('click', e => { const b = e.target.closest('[data-lb]'); if (b) { showLb(+b.dataset.lb); lb.classList.add('open'); } });
$('#lbClose').addEventListener('click', () => lb.classList.remove('open'));
$('#lbPrev').addEventListener('click', () => showLb(cur - 1));
$('#lbNext').addEventListener('click', () => showLb(cur + 1));
addEventListener('keydown', e => {
  if (e.key === 'Escape') { lb.classList.remove('open'); setCart(false); toggleNav(false); }
  if (lb.classList.contains('open')) { if (e.key === 'ArrowLeft') showLb(cur - 1); if (e.key === 'ArrowRight') showLb(cur + 1); }
});

/* ===== scroll reveal ===== */
document.querySelectorAll('.sec h2, .highlights div, .about p, .loc').forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));