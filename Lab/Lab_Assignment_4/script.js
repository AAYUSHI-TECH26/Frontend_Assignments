// ---------- Product data ----------
const DESC = "Comfortable wireless headphones with clear sound...";
const products = [
  { id: 1, name: "Wireless Headphones", price: 2499, oldPrice: 3499, rating: 4.5, inStock: true, desc: DESC,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" },
  { id: 2, name: "Smart Watch", price: 1999, oldPrice: 2999, rating: 4.2, inStock: true, desc: DESC,
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600" },
  { id: 3, name: "Running Shoes", price: 1799, oldPrice: 2499, rating: 4.4, inStock: true, desc: DESC,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" },
  { id: 4, name: "Coffee Maker", price: 1799, oldPrice: 2499, rating: 4.4, inStock: true, desc: DESC,
    img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600" },
  { id: 5, name: "Coffee Maker", price: 3499, oldPrice: 4499, rating: 4.1, inStock: false, desc: DESC,
    img: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600" }
];

let cart = [{ id: 2, qty: 2 }, { id: 1, qty: 1 }]; // [{ id, qty }] - preloaded like the sample

// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);
const fmt = (n) => "₹ " + n.toLocaleString("en-IN");
const discount = (p) => Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23ccc' width='100%25' height='100%25'/%3E%3C/svg%3E";

// ---------- Render products ----------
function renderProducts() {
  $("product-grid").innerHTML = products.map((p) => `
    <div class="card ${p.inStock ? "" : "out"}">
      <div class="img-wrap">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='${fallback}'">
        ${p.id === 1 ? '<div class="credit">Image from Unsplash</div>' : ""}
        ${p.inStock ? "" : '<span class="stock-tag">OUT OF STOCK</span>'}
      </div>
      <div class="card-body">
        <div class="title-row">
          <h3>${p.name}</h3>
          <span class="rating"><span>★</span> ${p.rating}</span>
        </div>
        <p class="desc">${p.desc}</p>
        <div class="price-row">
          <span class="price">${fmt(p.price)}</span>
          <span class="old">${fmt(p.oldPrice)}</span>
          <span class="off">${discount(p)}% OFF</span>
        </div>
        <button class="add-btn" data-id="${p.id}" ${p.inStock ? "" : "disabled"}>Add to Cart</button>
      </div>
    </div>`).join("");
}

// ---------- Cart logic ----------
function addToCart(id) {
  const item = cart.find((i) => i.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
}

function renderCart() {
  const box = $("cart-items");
  if (cart.length === 0) {
    box.innerHTML = '<p class="empty">Your cart is empty</p>';
  } else {
    box.innerHTML = cart.map((i) => {
      const p = products.find((x) => x.id === i.id);
      return `
        <div class="cart-item">
          <img src="${p.img}" alt="${p.name}" onerror="this.src='${fallback}'">
          <div class="ci-info">
            <h4>${p.name}</h4>
            <div>${fmt(p.price)}</div>
            <div class="qty">
              <span>Quantity:</span>
              <div class="qty-ctrl">
                <button data-act="dec" data-id="${p.id}">-</button>
                <span>${i.qty}</span>
                <button data-act="inc" data-id="${p.id}">+</button>
              </div>
            </div>
            <div class="subtotal"><span>Subtotal:</span><span>${fmt(p.price * i.qty)}</span></div>
          </div>
        </div>`;
    }).join("");
  }

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.qty * products.find((p) => p.id === i.id).price, 0);
  $("cart-count").textContent = totalItems;
  $("total-items").textContent = totalItems;
  $("grand-total").textContent = fmt(total);
}

// ---------- Events ----------
$("product-grid").addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (btn && !btn.disabled) addToCart(Number(btn.dataset.id));
});

$("cart-items").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.act === "inc") changeQty(id, 1);
  if (btn.dataset.act === "dec") changeQty(id, -1);
  if (btn.dataset.act === "rm") removeItem(id);
});

$("cart-btn").addEventListener("click", () => document.body.classList.toggle("cart-open"));
$("cart-close").addEventListener("click", () => document.body.classList.remove("cart-open"));
document.querySelector(".checkout").addEventListener("click", () =>
  alert(cart.length ? "Order placed successfully!" : "Your cart is empty!"));

// ---------- Init ----------
document.body.classList.add("cart-open"); // cart panel open by default
renderProducts();
renderCart();