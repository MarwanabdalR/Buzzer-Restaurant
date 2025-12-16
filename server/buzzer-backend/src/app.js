import "dotenv/config";
import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import authenticate from './middlewares/authMiddleware.js';

const app = express();

app.use(express.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Basic error handler to return JSON instead of HTML
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});