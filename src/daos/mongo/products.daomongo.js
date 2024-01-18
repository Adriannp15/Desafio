const { CustomError } = require('../../helpers/errors.js');
const { validateFields } = require('../../helpers/functions.js');
const { productModel } = require('./models/products.model.js');

class ProductDaoMongo {
  constructor() {
    this.model = productModel;
  }

  getProducts = async (reqQuery, reqOptions) => {
    const context = 'getProducts';
    // los validadores pueden se un midelware
    try {
      // Validación de parámetros
      if (!reqQuery || typeof reqQuery !== 'object') {
        throw new CustomError('The "query" parameter is invalid',400,context);
      }
      if (!reqOptions || typeof reqOptions !== 'object') {
        throw new CustomError('The "options" parameter is invalid',400,context);
      }

      const query = reqQuery || {};
      const options = {
        limit: Number(reqOptions.limit) || 10,
        page: Number(reqOptions.page) || 1,
      };

      if (reqQuery.category) {
        const categories = await this.getCategorys();
        if (categories.includes(reqQuery.category)) {
          query.category = reqQuery.category;
        }
      }

      if (reqQuery.availability) {
        query.stock = { $gt: 0 };
      }

      const sortOptions = {
        '1': 1,
        '-1': -1,
        asc: 'asc',
        desc: 'desc',
      };
      const sortValue  = sortOptions[reqOptions.sort];
      if (sortValue ) options.sort = { price: sortValue } ;

      return await this.model.paginate(query, options);
    } catch (error) {
      console.error(error);
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError('Unidentified error', 500, context);
      }
    }
  };

  getProductsById = async (pid) => {
    try {
      const product = await this.model.findById({ _id: pid }).lean();
      return product

    } catch (error) {
      console.error(error);
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError('Unidentified error', 500, context);
      }

    }
  };

  addProduct = async (fields) => {
    const requiredFields = [
      'title',
      'description',
      'code',
      'price',
      'stock',
      'status',
      'category',
      'thumbnail',
    ];
    try {
      const newProduct = validateFields(fields, requiredFields);
      if (typeof newProduct === 'string') {
        return newProduct;
      }

      return await this.model.create(newProduct);
    } catch (error) {
      if (error instanceof CustomError) {
        error.addContext('addProduct');
        throw error;
      } else if (error.code === 11000) {
        // Si es un error de código duplicado en MongoDB
        throw new CustomError(`ERROR: Código repetido`, 400, 'addProduct');
      } else {
        // Para otros errores no controlados
        throw new CustomError(
          `Verificar ERROR de mongoose código: ${error.code}`,
          400,
          'addProduct',
        );
      }
    }
  };

  updateProduct = async (pid, changedProduct) => {
    const updateProd = await this.getProductsById(pid);

    if (updateProd.length === 0) {
      return 'Producto no encontrado';
    }

    try {
      await this.model.updateOne({ _id: pid }, changedProduct);
      return await this.getProductsById(pid);
    } catch (error) {
      if (error.code === 11000) {
        return 'ERROR: esta queriendo ingresar un codigo repetido';
      }
      return 'ERROR: se ha producido une error al modificar el producto';
    }
  };

  deleteProductById = async (pid) => {
    const deleteProd = await this.getProductsById(pid);

    if (deleteProd.length === 0) {
      return 'Producto no encontrado';
    }
    try {
      await this.model.deleteOne({ _id: pid });
      return deleteProd;
    } catch (error) {
      return 'Hubo un error en la peticion';
    }
  };

  deleteProductByCode = async (pcode) => {
    const productoEliminado = await this.model.find({ code: pcode });

    if (productoEliminado.length === 0) {
      return 'Producto no encontrado';
    }
    try {
      await this.model.deleteOne({ code: pcode });
      return productoEliminado;
    } catch (error) {
      return 'Hubo un error en el la peticion';
    }
  };

  getCategorys = async () => {
    try {
      const categories = await this.model.aggregate([
        { $group: { _id: '$category' } },
        { $sort: { _id: 1 } },
      ]);
      return categories.map((x) => {
        return x._id;
      });
    } catch (error) {
      return 'Ocurrio un Error';
    }
  };
}

exports.ProductMongo = ProductDaoMongo;

