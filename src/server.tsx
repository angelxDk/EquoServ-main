import express from "express";
import cors from "cors";
import multer from "multer";
import router from "./routes/routes";
import Banco from "./config/database"; // Import the database instance
import "./database"; // Ensure this initializes your models
import path from "path";

const app = express();
const port = 3334;
const host = "0.0.0.0";
const reportsPath = path.join(process.cwd(), "reports");

app.use(cors());
app.use(express.json({ limit: "50mb" })); // Para JSON normal
app.use("/reports", express.static(reportsPath));

const storage = multer.memoryStorage(); // Guarda a imagem na memória (pode ser alterado para salvar em disco)
const upload = multer({ storage });

app.post("/upload-digital", upload.single("digital"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    console.log("Arquivo recebido:", req.file);

    return res.status(200).json({ message: "Digital recebida com sucesso" });
  } catch (error) {
    console.error("Erro ao salvar digital:", error);
    return res.status(500).json({ message: "Erro ao processar o arquivo" });
  }
});

Banco.authenticate()
  .then(() => {
    console.log("Database connected successfully");

    app.use(router);

    app.get("/", (req, res) => {
      return res.json("first route");
    });

    app.listen(port, host, () => {
      console.log(`Servidor rodando em http://${host}:${port}`);
      console.log(
        `Acesse no navegador usando o IP da máquina: http://<SEU_IP_LOCAL>:${port}`
      );
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
