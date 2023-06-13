//front
const socket = io();

const formProducts = document.getElementById("form-products");
const inputTitle = document.getElementById("form-title");
const inputDescript = document.getElementById("form-description");
const inputPrice = document.getElementById("form-price");
const inputCode = document.getElementById("form-code");
const inputStock = document.getElementById("form-stock");
const inputCategory = document.getElementById("form-category");
const inputThumbnail = document.getElementById("form-thumbnail");

function deleteProduct(productId) {
  console.log("cualquier cosa");
  socket.emit("delete-product", productId);
}

socket.on("products", (products) => {
  console.log(products);
  document.getElementById("dinamic-list").innerHTML = products.reduce(
    (acc, item) => {
      return (
        acc +
        `
      <div>
        <p>${item.id}</p>
        <p>${item.title}</p>
        <p>${item.description}</p>
        <p>${item.price}</p>
        <p>${item.code}</p>
        <p>${item.stock}</p>
        <p>${item.category}</p>
        <button style="background-color: red;" type="button" onclick="deleteProduct('${item.id}')">X</button>
        <hr />
      </div>
      `
      );
    },
    ""
  );
});

formProducts.onsubmit = (e) => {
  e.preventDefault();
  const newProduct = {
    title: inputTitle.value,
    description: inputDescript.value,
    price: +inputPrice.value,
    thumbnail: inputThumbnail.value,
    code: inputCode.value,
    stock: +inputStock.value,
    category: inputCategory.value,
  };
  socket.emit("new-product", newProduct);
  formProducts.reset();
};
