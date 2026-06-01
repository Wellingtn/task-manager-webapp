const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const taskRoutes = require("./src/routes/tasks");
const { testConnection } = require("./src/db");
const errorHandler = require("./src/middleware/errorHandler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

app.get("/health", async (req, res, next) => {
  try {
    await testConnection();
    res.json({
      ok: true,
      message: "Servidor e conexão com banco funcionando."
    });
  } catch (error) {
    next(error);
  }
});

app.use("/api/tasks", taskRoutes);
app.use(express.static(FRONTEND_DIR));

app.get("*", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

app.use(errorHandler);

app.listen(PORT, "0.0.0.0", async () => {
  try {
    await testConnection();
    console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
  } catch (error) {
    console.error("Servidor iniciado, mas houve falha ao conectar no MySQL.");
    console.error(error.message);
  }
});
