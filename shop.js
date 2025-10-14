/* shop.js - Shipping, tax, localStorage, Stripe-ready client */
function getSelectedShippingKey() {
return shippingSelect.value || 'free';
}


function getShippingAmount() {
const key = getSelectedShippingKey();
return SHIPPING_OPTIONS[key] ?? 0;
}


function calcTax(subtotal) {
return subtotal * TAX_RATE;
}


function calcTotal() {
const subtotal = calcSubtotal();
const shipping = getShippingAmount();
const tax = calcTax(subtotal);
return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}


function renderCart() {
cartItemsEl.innerHTML = '';
const entries = Object.entries(cart);
if (entries.length === 0) {
cartItemsEl.innerHTML = `<p style="color:#9b9b9b; padding:1rem;">Your cart is empty.</p>`;
} else {
for (const [id, item] of entries) {
const div = document.createElement('div');
div.className = 'cart-item';
div.innerHTML = `
<img src="${item.product.img}" alt="${escapeHtml(item.product.title)}">
<div class="ci-info">
<div class="ci-title">${escapeHtml(item.product.title)}</div>
<div class="ci-meta">$${item.product.price.toFixed(2)} each</div>
</div>
<div class="ci-actions">
<input type="number" min="1" value="${item.qty}" data-id="${id}" class="cart-qty">
<button class="btn secondary remove-btn" data-id="${id}">Remove</button>
</div>
`;
cartItemsEl.appendChild(div);
}
}


// totals
const { subtotal, shipping, tax, total } = calcTotal();
summarySubtotalEl.textContent = subtotal.toFixed(2);
summaryTaxEl.textContent = tax.toFixed(2);
summaryTotalEl.textContent = total.toFixed(2);


updateCartCount();
saveCart();


// attach handlers
document.querySelectorAll('.remove-btn').forEach(b => b.onclick = e => {
const id = e.currentTarget.dataset.id;
delete cart[id];
renderCart();
});


document.querySelectorAll('.cart-qty').forEach(inp => {
inp.addEventListener('change', e => {
const id = e.target.dataset.id;
const val = parseInt(e.target.value, 10) || 1;
cart[id].qty = Math.max(1, val);
renderCart();
});
});
}


function escapeHtml(str) { return str.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'})[c] || c); }


function addToCart(id, qty = 1) {
const product = products.find(p => p.id === id);
if (!product) return;
if (!cart[id]) cart[id] = { product, qty: 0 };
cart[id].qty += qty;
renderCart();
}


// initialize product event listeners (modal + add buttons)
products.forEach(p => {
	p.el.querySelector('img').addEventListener('click', () => {
		modalImg.src = p.img;
		modalTitle.textContent = p.title;
		modalPrice.textContent = `$${p.price.toFixed(2)}`;
	});
});