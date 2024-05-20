import fs from "fs";

let carts = [];
const pathFile = "./src/data/carts.json";

const getCarts = async () => {
  const cartsJson = await fs.promises.readFile(pathFile, "utf-8");
  const cartsPars = JSON.parse(cartsJson);
  carts = cartsPars || [];
};

const createCart = async () => {
  await getCarts();
  const newCart = {
    id: carts.length + 1,
    products: [],
  };

  carts.push(newCart);

  await fs.promises.writeFile(pathFile, JSON.stringify(carts));
  return newCart;
};

const getCartById = async (cid) => {

  await getCarts();
  const cart = carts.find((c) => c.id === cid);
  return cart;
};

const addProductToCart = async (cid, pid) => {
  await getCarts();
  const product = {
    product: pid,
    quantity: 1,
  };

  const cartIndex = carts.findIndex((cart) => cart.id === cid);

  const cart = carts[cartIndex];
  const productIndex = cart.products.findIndex((item) => item.product === pid);

  if (productIndex !== -1) {

    cart.products[productIndex].quantity += 1;
  } else {

    const newProduct = {
      product: pid,
      quantity: 1,
    };
    cart.products.push(newProduct);
  }

  await fs.promises.writeFile(pathFile, JSON.stringify(carts));

  return carts[cartIndex];
};

export default {
  getCarts,
  getCartById,
  addProductToCart,
  createCart,
};