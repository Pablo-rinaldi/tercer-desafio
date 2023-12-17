const express = require("express");

const app = express();

const PORT = 8080;

const ProductManager = require("./product-manager.js");

const manager = new ProductManager("./src/products.json");

//Se echará a andar el servidor

app.listen(PORT, () => {
  console.log(`Listening http://localhost:${PORT}`);
});

app.use(express.urlencoded({ extended: true }));

//Se mandará a llamar desde el navegador a la url http://localhost:8080/products?limit=5 , eso debe devolver sólo los primeros 5 de los 10 productos.
//Se mandará a llamar desde el navegador a la url http://localhost:8080/products sin query, eso debe devolver todos los 10 productos.

app.get("/products", async (req, res) => {
  let limit = parseInt(req.query.limit);

  const products = await manager.readFiles();

  if (limit) {
    const limitedProducts = products.slice(0, limit);
    res.send(limitedProducts);
  } else {
    res.send(products);
  }
});

//Se mandará a llamar desde el navegador a la url http://localhost:8080/products/2, eso debe devolver sólo el producto con id=2.
//Se mandará a llamar desde el navegador a la url http://localhost:8080/products/34123123, al no existir el id del producto, debe devolver un objeto con un error indicando que el producto no existe.

app.get("/products/:id", async (req, res) => {
  let id = parseInt(req.params.id);

  const prodList = await manager.readFiles();

  const product = prodList.find((item) => item.id == id);

  if (product) {
    res.send(product);
  } else {
    res.send("Producto no encontrado");
  }
});
