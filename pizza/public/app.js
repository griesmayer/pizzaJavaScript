async function fetchOrders() {
  const statusEl = document.getElementById("status");
  const tbody = document.querySelector("#orders-table tbody");

  try {
    // Set the status
    statusEl.textContent = "Load data...";

    // Use the route to get the data
    const res = await fetch("/orders");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Get an array of orders
    const orders = await res.json();

    // Clear the table
    tbody.innerHTML = "";

    // Add rows to the table
    for (const o of orders) {
      const tr = document.createElement("tr");

      const tdId = document.createElement("td");
      tdId.textContent = o.id;

      const tdName = document.createElement("td");
      tdName.textContent = o.name;

      const tdPizza = document.createElement("td");
      tdPizza.textContent = o.pizza;

      tr.append(tdId, tdName, tdPizza);
      tbody.appendChild(tr);
    }

    statusEl.textContent = `Loaded: ${orders.length} orders`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error while loading the data.";
  }
}

async function addClick() {
    const nameInput   = document.getElementById("name");
    const name = nameInput.value.trim();
    const pizzaInput = document.getElementById("pizza");
    const pizza = pizzaInput.value.trim();
    const button = document.getElementById("add-btn");
    const statusEl = document.getElementById("status");

    if (!name || !pizza) {
      statusEl.textContent = "Name and pizza is required.";
      return;
    }

    button.disabled = true;
    await addOrder(name, pizza);
    button.disabled = false;

    nameInput.value = "";
    pizzaInput.value = "";
    nameInput.focus();
}

async function addOrder(name, pizza) {
  const statusEl = document.getElementById("status");
  try {
    const res = await fetch("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pizza }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await fetchOrders();
    statusEl.textContent = "Order added.";
  } catch (err) {
    console.error(err);
    statusEl.textContent = `Error while adding a new order: ${err.message}`;
  }
}

// When page isloaded the fetchStudents is called
window.addEventListener("DOMContentLoaded", fetchOrders);