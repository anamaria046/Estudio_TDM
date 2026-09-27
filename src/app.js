import express from "express";
import path from "node:path";
import cors from "cors";
import morgan from "morgan";
import itemsRouter from "./routers/items.js";
import { notFoundHandler, errorHandler } from "./middlewares/errors.js";

const app = express();
const PUBLIC_PATH = path.join(import.meta.dirname, "..", "public");

// Middlewares globales
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Archivos estáticos del frontend (HTML, CSS, JS)
app.use(express.static(PUBLIC_PATH));

// Rutas de la API
app.use("/api/items", itemsRouter);

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
