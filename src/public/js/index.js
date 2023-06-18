const addProductForm = document.getElementById("addProductForm");
const addProductFormReal = document.getElementById("addProductFormReal");
const productsList = document.getElementById("productsList");

console.log("aca estroy");
async function deleteProduct(id) {
  const response = await fetch(`/api/products/${id}`, {
    method: "delete",
  });
  if (response.ok) {
    const li = document.getElementById(id);
    li.remove();
  } else {
    console.error();
    alert("Product couldn't be deleted");
  }
}

function deleteProductSocket(id) {
  socket.emit("deleteProduct", id);
}

try {
  addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(addProductForm);
    const entries = Array.from(formData.entries());
    const formDataObject = entries.reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
    const response = await fetch("/api/products", {
      method: "post",
      body: JSON.stringify(formDataObject),
      headers: {
        "content-type": "application/json",
      },
    });
    const product = await response.json();
    if (response.ok) {
      const li = `
            <li id="${product.id}">
                <div>
                    <p>${product.title} - ${product.description} - ${product.price} - ${product.thumbnail} - ${product.code} - ${product.stock} - ${product.category}</p>
                    <button onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </li>
            `;
      productsList.innerHTML += li;
      addProductForm.reset();
    } else {
      alert("Error, product not loaded");
    }
  });
} catch (error) {}

try {
  socket.on("connect", () => {
    console.log("Successful connection");
  });
  socket.on("addedProduct", (product) => {
    const li = `
        <li id="${product.id}">
            <div>
                <p>${product.title} - ${product.description} - ${product.price} - ${product.thumbnail} - ${product.code} - ${product.stock} - ${product.category}</p>
                <button onclick="deleteProductSocket('${product.id}')">Delete</button>
            </div>
        </li>
        `;
    productsList.innerHTML += li;
  });

  socket.on("deletedProduct", (id) => {
    const li = document.getElementById(id);
    li.remove();
  });

  addProductFormReal.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(addProductFormReal);
    const entries = Array.from(formData.entries());
    const formDataObject = entries.reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
    socket.emit("addProduct", formDataObject);
  });
  addProductFormReal.reset();
} catch (error) {}

///----------FETCH CART----------

let cartId = localStorage.getItem("cart-id");
const API_URL = "http://localhost:8080/api";

function putIntoCart(_id) {
  cartId = localStorage.getItem("cart-id");
  const url = API_URL + "/carts/" + cartId + "/product/" + _id;
  const data = {};
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      alert("added");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(JSON.stringify(error));
    });
}

if (!cartId) {
  alert("no id");
  const url = API_URL + "/carts";
  const data = {};
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log("Response:", data);
      const cartId = localStorage.setItem("cart-id", data._id);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(JSON.stringify(error));
    });
}

/*
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

console.log("hola");
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

const carritoId = localStorage.getItem("carrito-id");
function putIntoCart(_id) {
  alert("agregar "+ _id + "al carro " + carritoId)
} 

if (!carritoId) {
  alert("no id");
  const url = "http://localhost:8080/api/carts";

  const data = {};

  const options = {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body:JSON.stringify(data) ,
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log("Response: ", data);
      alert(JSON.stringify(data._id));
      const carritoId = localStorage.setItem("carrito-id", data._id);
    })
    .catch((error) => {
      console.log("Error:", error);
      alert(JSON.stringify(error));
    });
} else {
  alert(carritoId);
}
*/
