let editingId = null;

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
      const tdPizza = document.createElement("td");
      const tdActions = document.createElement("td");

      if (editingId === o.id) {
        // Edit mode
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = o.name;
        nameInput.className = "input-sm";

        const pizzaInput = document.createElement("input");
        pizzaInput.type = "text";
        pizzaInput.value = o.pizza;
        pizzaInput.className = "input-sm";

        tdName.appendChild(nameInput);
        tdPizza.appendChild(pizzaInput);

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.className = "save-btn";
        saveBtn.onclick = async () => {
          if (!nameInput.value.trim() || !pizzaInput.value.trim()) {
            document.getElementById("status").textContent = "Name and pizza is required!";
            return;
          }
          await updateOrder(o.id, {
            name: nameInput.value.trim(),
            pizza: pizzaInput.value.trim(),
          });
          editingId = null;
          await fetchOrders();
        };

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.className = "cancel-btn";
        cancelBtn.onclick = async () => {
          editingId = null;
          await fetchOrders();
        };

        tdActions.append(saveBtn, " ", cancelBtn);
      } else {
        // View mode
        tdName.textContent = o.name;
        tdPizza.textContent = o.pizza;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.onclick = () => {
          editingId = o.id;
          fetchOrders();
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "delete-btn";
        delBtn.onclick = async () => {
          if (!confirm(`Pizza ${o.name} realy delete?`)) return;
          await deleteOrder(o.id);
          await fetchOrders();
        };

        tdActions.append(editBtn, " ", delBtn);
      }

      tr.append(tdId, tdName, tdPizza, tdActions);
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

async function deleteOrder(id) {
  const statusEl = document.getElementById("status");
  try {
    const res = await fetch(`/orders/${id}`, { method: "DELETE" });
    if (res.status === 204) {
      statusEl.textContent = `Order ${id} removed.`;
    } else {
      throw new Error(msg.error || `HTTP ${res.status}`);
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = `Error while removing: ${err.message}`;
  }
}

async function updateOrder(id, data) {
  const statusEl = document.getElementById("status");
  try {
    const res = await fetch(`/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({}));
      throw new Error(msg.error || `HTTP ${res.status}`);
    }
    statusEl.textContent = `Order ${id} changed.`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = `Error wile changing the data: ${err.message}`;
  }
}

// When page isloaded the fetchStudents is called
window.addEventListener("DOMContentLoaded", fetchOrders);