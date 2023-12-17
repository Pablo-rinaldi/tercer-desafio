const fs = require("fs").promises;

class ProductManager {
  static id = 0;
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(newObject) {
    let { title, description, price, img, code, stock } = newObject;

    if (!title || !description || !price || !img || !code || !stock) {
      console.log("Faltan ingresar datos");
      return;
    }
    if (this.products.some((prod) => prod.code === code)) {
      console.log("No se puede agregar, Ya existe un producto con ese codigo");
      return;
    }

    const newProduct = {
      id: ++ProductManager.id,
      title,
      description,
      price,
      img,
      code,
      stock,
    };
    this.products.push(newProduct);

    await this.saveFiles(this.products);
  }

  getProducts() {
    console.log(this.products);
  }

  async readFiles() {
    try {
      const res = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(res);
      return arrayProductos;
    } catch (error) {
      console.log("no se pudo leer ", error);
    }
  }

  async saveFiles(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("no se pudo guardar el archivo", error);
    }
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.readFiles();
      const res = arrayProductos.find((item) => item.id === id);
      if (res) {
        console.log("encontrado!", res);
        return res;
      } else {
        console.log("no se encontro");
      }
    } catch (error) {
      console.log("error al leer el archivo", error);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const arrayProductos = await this.readFiles();
      const index = arrayProductos.findIndex((item) => item.id === id);

      if (index !== -1) {
        arrayProductos[index] = updatedProduct;
        this.products = arrayProductos;
        await this.saveFiles(this.products);
        console.log("se actualizo");
      } else {
        console.log("no se encontro el producto");
      }
    } catch (error) {
      console.log("error al actualizar", error);
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.readFiles();
      const index = arrayProductos.findIndex((item) => item.id === id);
      if (index !== -1) {
        const newProducts = arrayProductos.filter(
          (product) => product.id !== id
        );
        this.products = newProducts;
        await this.saveFiles(this.products);
        console.log("se elimino");
      } else {
        console.log("no se encontro el id del producto");
      }
    } catch (error) {
      console.log("Error al borrar");
    }
  }
}

module.exports = ProductManager;
