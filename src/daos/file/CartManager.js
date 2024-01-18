const fs = require("fs");

class CartManager {
  constructor (path) {
    this.counterId = 0;
    this.cart = [];
    this.path = path || './mock/Carts.json';
    this.initiator();
  }

  async initiator() {
    await this.getCarts(-1, true);
    this.getId();
  }

  async create() {
    const cart = {
      id: this.counterId,
      cart: []
    }
    this.cart.push(cart);
    
    this.counterId++;
    const jsonCart = JSON.stringify(this.cart);
    await fs.promises.writeFile(this.path, jsonCart);

    return (this.counterId - 1)
  }

  async getCarts( id = -1, synchronize = false) {
    let getCarts;
    const exists = fs.existsSync(this.path);
    if (!exists) {
      getCarts = [];
    } else {
      getCarts = await fs.promises.readFile(this.path, 'utf-8')
      getCarts = JSON.parse(getCarts)
    }

    if (synchronize === true) this.cart = getCarts
    if(id === -1) return getCarts

    const cart = getCarts.find((crt) => crt.id === id);
    return cart ? cart : 'Carrito no encontrado';
  }

  async addProduct(id, productId) {
    if (!this.cart[id]) return "Carrito no encontrado"

    const i = this.cart[id].cart.findIndex((elm) => elm.productId === productId)

    if (i === -1) {
      this.cart[id].cart.push({
        productId: productId,
        quantity: 1
      })
    } else {
      this.cart[id].cart[i].quantity++
    }
    
    const jsonCart = JSON.stringify(this.cart);
    await fs.promises.writeFile(this.path, jsonCart);

    return (this.cart[id])
  }

  async removeProduct(id, productId) {
    if (!this.cart[id]) return "Carrito no encontrado"

    const i = this.cart[id].cart.findIndex((elm) => elm.productId === productId)

    if (i === -1) {
      return "Producto no encontrado"
    } else {
      if (this.cart[id].cart[i].quantity===1) {
        this.cart[id].cart.splice(i,1)
      } else {
        this.cart[id].cart[i].quantity--
      }
    }
    
    const jsonCart = JSON.stringify(this.cart);
    await fs.promises.writeFile(this.path, jsonCart);

    return (this.cart[id])
  }

  // METODOS AUXILIARES

  // revisa el Id maximo de los productos para iniciar su contador
  getId() {
    const exists = fs.existsSync(this.path);
    if (!exists) {
      this.counterId = 0
    } else {
      this.counterId = this.cart.reduce((maxId, crt) => { return Math.max(maxId, crt.id) } , 0)
      this.counterId ++;
    }
  };
}

exports.CartManager = CartManager;