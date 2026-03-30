async function loadOrders() {
  const res = await fetch("https://YOUR_BACKEND_URL/orders");
  const data = await res.json();

  const container = document.getElementById("orders");
  container.innerHTML = "";

  data.forEach(order => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${order.name}</h3>
      <p>Room: ${order.room}</p>
      <p>Items: ${order.items.join(", ")}</p>
    `;

    container.appendChild(div);
  });
}

loadOrders();
