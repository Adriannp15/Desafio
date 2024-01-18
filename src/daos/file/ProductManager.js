const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path || './mock/Productos.json';
    this.counterId = 0;
    this.products = [];

    this.initiator()
  }

  async initiator() {
    await this.getProducts(true);
    this.getId();
  }

  getProducts = async (synchronize = false) => {
    let productObtained;
    const exists = fs.existsSync(this.path);
    if (!exists) {
      productObtained = [];
    } else {
      productObtained = await fs.promises.readFile(this.path, 'utf-8');
      productObtained = JSON.parse(productObtained);
    }

    if (synchronize) {
      this.products = productObtained;
    }

    return productObtained;
  };

  getProductsById = async (id) => {
    let productsObtained = [];
    productsObtained = await this.getProducts();

    const product = productsObtained.find((prod) => prod.id === id);
    return product ? product : 'Producto no encontrado';
  };

  addProduct = async ({title, description, code, price, stock, status = true, category, thumbnail = ""}) => {
    if (!title || !description || !code || !price || !stock || !status || !category) {
      
      if (!title) return "ERROR: debe completar el titulo"
      if (!description) return "ERROR: debe completar la descripción"
      if (!code) return "ERROR: debe completar el Código"
      if (!price) return "ERROR: debe completar el Precio"
      if (!stock) return "ERROR: debe completar el Stock"
      if (!status) return "ERROR: debe completar el Estado"
      if (!category) return "ERROR: debe completar la Categoria"

      return 'ERROR: debe completar todos los campos';
    }

    const exists = this.products.some((p) => p.code === code);
    if (exists) {
      return 'ERROR: codigo repetido';
    }

    const newProduct = {
      id: this.counterId,
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      category: category,
      thumbnail: thumbnail,
    };

    this.counterId++;
    this.products.push(newProduct);
    const jsonProduct = JSON.stringify(this.products, null, 2);
    await fs.promises.writeFile(this.path, jsonProduct);
    return newProduct;
  };

  updateProduct = async (id, changedProduct) => {
    const i = this.products.findIndex((elm) => elm.id === id);

    if (i === -1) {
      return 'Producto no encontrado';
    } else {
      const keys = Object.keys(changedProduct);
      keys.forEach((k) => {
        this.products[i][k] = changedProduct[k];
      });
    }

    const jsonProduct = JSON.stringify(this.products, null, 2);
    await fs.promises.writeFile(this.path, jsonProduct);
    return this.products[i];
  };

  async deleteProduct(id) {
    const i = this.products.findIndex((elm) => elm.id === id);

    if (i === -1) {
      return 'Producto no encontrado';
    } else {
      const removedProduct = this.products[i]
      const newProducts = this.products.filter((elm) => elm.id != id);
      this.products = newProducts;
      const jsonProduct = JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, jsonProduct);
      return removedProduct;
    }
  }

  async deleteProductByCode(code) {
    const i = this.products.findIndex((elm) => elm.code === code);

    if (i === -1) {
      return 'Producto no encontrado';
    } else {
      const removedProduct = this.products[i]
      const newProducts = this.products.filter((elm) => elm.code != code);
      this.products = newProducts;
      const jsonProduct = JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, jsonProduct);
      return removedProduct;
    }
  }
  // METODOS AUXILIARES

  // revisa el Id maximo de los productos para iniciar su contador
  getId() {
    const exists = fs.existsSync(this.path);
    if (!exists) {
      this.counterId = 0
    } else {
      this.counterId = this.products.reduce((maxId, prd) => { return Math.max(maxId, prd.id) } , 0)
      this.counterId ++;
    }
  };
}

exports.PManager = ProductManager;
