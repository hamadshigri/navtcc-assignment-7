const API = "https://dummyjson.com/users";
const table = document.getElementById("userTable");
const loader = document.getElementById("loader");
let users = [];
let editId = null;


// Get User data
async function getUsers() {
  loader.classList.remove('hidden');
  try {
    const res = await fetch(API);
    const data = await res.json();
    users = data.users;
    renderUsers(users);
  } catch (err) {
    alert('Error fetching users');
  }
  loader.classList.add('hidden');
}

function renderUsers(data) {
  table.innerHTML = '';
  data.forEach(user => {
    const row = `
    <tr class="border-b">
    <td class="p-2">${user.id}</td>
    <td class="p-2">${user.firstName}</td>
    <td class="p-2">${user.lastName}</td>
    <td class="p-2">${user.email}</td>
    <td class="p-2">${user.phone}</td>
    <td class="p-2 space-x-2">
    <button onclick="editUser(${user.id})" class="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
    <button onclick= "deleteUser(${user.id}) "class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
    </td>
    </tr>
    `;

    table.innerHTML += row;
  })
}

// Add or Update User
const form = document.getElementById("userForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let userData = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    phone: phone.value
  };

  try {
    if (editId) {
      await fetch(`${API}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      users = users.map(u => u.id === editId ? { ...u, ...userData } : u);
      alert("User Updated");
      editId = null;
    } else {
      let res = await fetch(`${API}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const newUser = await res.json();
      users.unshift(newUser);
      alert('User added');
    }

    renderUsers(users);
    form.reset();
  } catch (err) {
    alert('Error saving user');
  }
})

// Edit User
function editUser(id) {
  const user = users.find(u => u.id === id);
  firstName.value = user.firstName;
  lastName.value = user.lastName;
  email.value = user.email;
  phone.value = user.phone;
  editId = id;
}


// Delete User
async function deleteUser(id) {
  if (!confirm('Are you sure?')) return;

  try {
    await fetch(`${API}/${id}`, {
      method: 'DELETE'
    });
    users = users.filter(u => u.id !== id);
    renderUsers(users);
    alert('User deleted');
  } catch (err) {
    alert('Delete failed');
  }
}

const searchInput = document.getElementById("search");
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();

  if (query === '') return renderUsers(users);

  try {
    const res = await fetch(`${API}/search?q=${query}`);
    const data = await res.json();
    renderUsers(data.users);
  } catch (err) {
    alert('Search failed');
  }
})


getUsers();