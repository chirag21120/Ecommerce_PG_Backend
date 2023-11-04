const express = require("express");
const {
  createProduct,
  fetchAllProduct,
  fetchProductById,
  updateProduct,
  fetchAdminProducts,
} = require("../controller/Product");

const router = express.Router();

router
  .post("/", createProduct)
  .get("/", fetchAllProduct)
  .get("/admin/", fetchAdminProducts)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct)

exports.router = router;
