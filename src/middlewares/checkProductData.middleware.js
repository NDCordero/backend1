import { request, response } from "express";
import productDao from "../dao/mongoDB/product.dao.js";


//Valida la información del producto (campos obligatorios y no repetición de code)
export const checkProductData = async (req = request, res = response, next) => {
  try {
    const { title, description, price, code, stock, category } = req.body;
    const newProduct = {
      title,
      description,
      price,
      code,
      stock,
      category,
    };

    const products = await productDao.getAll();
    
    // Valida que no se repita el campo code
    const productExists = products.docs.find((p) => p.code === code);
    if (productExists) return res.status(400).json({ status: "Error", msg: `El producto con el código ${code} ya existe` });

    // Valida que los campos obligatorios esten completos
    const checkData = Object.values(newProduct).includes(undefined);
    if (checkData) return res.status(400).json({ status: "Error", msg: "Todos los datos son obligatorios" });

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};

export const checkProductId = async (req = request, res = response, next) => {
  try {
    const { pid } = req.params;
    const product = await productDao.getById(pid);

    if (!product) {
      return res.status(404).json({ status: "Error", msg: `No se encontró el producto con el ID: ${pid}` });
    }

    // Guarda el producto en el request para evitar buscarlo de nuevo en la ruta
    req.product = product;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};