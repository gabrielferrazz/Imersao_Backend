import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";

// Configurações de CORS com origens permitidas
const allowedOrigins = [
    "https://imersao-frontend-six.vercel.app",
    "https://imersao-frontend-git-main-gabriel-ferrazs-projects-8cfbdacd.vercel.app",
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
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

const upload = multer({ dest: "./uploads", storage });

// Define as rotas do aplicativo
const routes = (app) => {
    app.use(express.json());
    app.use(cors(corsOptions));

    // Configura o servidor estático para acessar arquivos da pasta "uploads"
    app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

    // Define as rotas da API
    app.get("/posts", listarPosts);
    app.post("/posts", postarNovoPost);
    app.post("/upload", upload.single("imagem"), uploadImagem);
    app.put("/upload/:id", atualizarNovoPost);
};

export default routes;
