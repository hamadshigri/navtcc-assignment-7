const API = "https://fakestoreapi.com/products";
let products = [];
let editId = null;

const prodContainer = document.getElementById("products");
const loader = document.getElementById("loader");

// Get Products
async function getProducts() {
  loader.classList.remove("hidden");
  try {
    const res = await fetch(API);
    products = await res.json();
    renderProducts(products);
  } catch (err) {
    alert('Error fetching products');
  }
  loader.classList.add('hidden');
}

function renderProducts(data) {
  prodContainer.innerHTML = '';

  if (data.length === 0) {
    prodContainer.innerHTML = '<p>No products found</p>';
    return;
  }

  data.forEach(prod => {
    const card = `
      <div class="bg-white p-4 rounded shadow hover:shadow-lg transition">
        <img src="${prod.image}" class="h-40 object-contain mx-auto mb-2" />
        <h2 class="font-bold">${prod.title}</h2>
        <p class="text-sm">${prod.description.slice(0, 60)}...</p>
        <p class="font-semibold ${prod.price < 20 ? 'text-green-500' : ''}">${prod.price}</p>
        <p class="text-xs text-gray-500">${prod.category}</p>
        <div class="mt-2 space-x-2">
          <button onclick="editProduct(${prod.id})" class="bg-yellow-400 px-2 py-1 rounded">Edit</button>
          <button onclick="deleteProduct(${prod.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </div>
      </div>
      `;

    prodContainer.innerHTML += card;
  })
}

// Add / Update

const form = document.getElementById("productForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    title: title.value,
    price: parseFloat(price.value),
    image: image.value,
    category: category.value,
    description: description.value
  }

  try {
    if (editId) {
      await fetch(`${API}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      products = products.map(prod => prod.id === editId ? { ...prod, ...data } : prod);
      alert('Product Updated');
      editId = null
    } else {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const newProduct = await res.json();
      products.unshift(newProduct);
      alert('Product Added');
    }

    renderProducts(products);
    form.reset();
  } catch (err) {
    alert('Error adding product');
  }
});


// Edit Product
function editProduct(id) {
  const p = products.find(p => p.id === id);
  title.value = p.title;
  price.value = p.price;
  description.value = p.description;
  image.value = p.image;
  category.value = p.category;
  editId = id;
}

// Delete Product

async function deleteProduct(id) {
  if (!confirm('Do you want to delete the product?')) return;

  try {
    await fetch(`${API}/${id}`, {
      method: 'DELETE'
    });
    products = products.filter(p => p.id !== id);
    renderProducts(products);
  } catch {
    alert('Delete product failed');
  }
}


// Filter Products

const filter = document.getElementById('filter');
filter.addEventListener('change', async () => {
  const val = filter.value;

  if (!val) return renderProducts(products);

  try {
    const res = await (fetch(`${API}/category/${val}`));
    const data = await res.json();
    renderProducts(data);
  } catch {
    alert('Filter error');
  }
})

getProducts();