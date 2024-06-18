import { productModel } from "./models/product.model.js";

//Busca todos los productos, filtra en caso que se ingresen condiciones de paginado, limite, orden, etc.
const getAll = async (query, options) => {
  const products = await productModel.paginate(query, options);
  return products;
};

//Busca producto por Id
const getById = async (id) => {
  const product = await productModel.findById(id);
  return product;
};

//Crea un producto nuevo
const create = async (data) => {
  const product = await productModel.create(data);
  return product;
};

//Actualiza producto
const update = async (id, data) => {
  const productUpdate = await productModel.findByIdAndUpdate(id, data, { new: true });
  return productUpdate;
};

//Elimina un producto por Id
const deleteOne = async (id) => {
  const product = await productModel.findByIdAndUpdate(id, { status: false }, { new: true });
  return product;
};

export default {
  getAll,
  getById,
  create,
  update,
  deleteOne
}