import { Router } from "express";
import cartDao from "../dao/mongoDB/cart.dao.js"
import { checkProductId } from "../middlewares/checkProductId.middleware.js";

const router = Router();


//Ruta que crea un carrito
router.post("/", async (req, res) => {
  try {
    const cart = await cartDao.create();

    res.status(201).json({ status: "success", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});


//Ruta a todos los carritos
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.getById(cid);
    if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el ID: ${cid}` });

    res.status(200).json({ status: "success", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});


// Ruta que agrega producto al carrito
router.post("/:cid/product/:pid", checkProductId, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const product = req.product; // Producto validado por el middleware
    const cart = await cartDao.getById(cid);
    if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el ID: ${cid}` });

    const cartUpdate = await cartDao.addProductToCart(cid, pid);
    res.status(200).json({ status: "success", cartUpdate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

// Ruta que elimina un producto del carrito
router.delete("/:cid/product/:pid", checkProductId, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const product = req.product; // Producto validado por el middleware
    const cart = await cartDao.getById(cid);
    if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el ID: ${cid}` });

    const cartUpdate = await cartDao.deleteProductInCart(cid, pid);
    res.status(200).json({ status: "success", cartUpdate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

// Ruta que actualiza cantidad del producto en carrito
router.put("/:cid/product/:pid", checkProductId, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const product = req.product; // Producto validado por el middleware
    const cart = await cartDao.getById(cid);
    if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el ID: ${cid}` });

    const cartUpdate = await cartDao.updateQuantityProductInCart(cid, pid, Number(quantity));
    res.status(200).json({ status: "success", payload: cartUpdate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
});

//Ruta que elimina los productos del carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.clearProductsInCart(cid);
    if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });

    res.status(200).json({ status: "success", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

export default router;