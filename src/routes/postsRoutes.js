import express from "express";
import multer from "multer";
import cors from "cors";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";

const corsOptions = {
    origin: (origin, callback) => {
        // Permite qualquer domínio HTTPS ou requisições sem origem (Postman/local)
        if (origin?.startsWith("https://") || !origin) {
            callback(null, true);
        } else {
            callback(new Error("CORS blocked this origin"));
        }
    },
    optionsSuccessStatus: 200,
};

// Configuração de armazenamento do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

// Cria uma instância do Multer com o destino e configuração de armazenamento definidos
const upload = multer({ dest: "./uploads", storage });

// Define as rotas do aplicativo
const routes = (app) => {
    app.use(express.json());
    app.use(cors(corsOptions));
    app.get("/posts", listarPosts);
    app.post("/posts", postarNovoPost);
    app.post("/upload", upload.single("imagem"), uploadImagem);
    app.put("/upload/:id", atualizarNovoPost);
};

export default routes;
