import express from "express"; // Importa o framework Express para criar e gerenciar o servidor
import multer from "multer"; // Importa o Multer para lidar com upload de arquivos
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js"; // Importa as funções do controlador de posts
import cors from "cors";

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}
// Configuração de armazenamento para o Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define a pasta "uploads/" como destino dos arquivos enviados
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Define o nome do arquivo como o nome original enviado pelo cliente
    }
});

// Cria uma instância do Multer com o destino e configuração de armazenamento definidos
const upload = multer({ dest: "./uploads", storage });

// Define as rotas do aplicativo
const routes = (app) => {
    app.use(express.json()); // Adiciona middleware para interpretar o corpo das requisições no formato JSON
    app.use(cors(corsOptions));
    app.get("/posts", listarPosts); // Define uma rota GET para "/posts" que retorna todos os posts do banco de dados
    app.post("/posts", postarNovoPost); // Define uma rota POST para "/posts" que cria um novo post
    app.post("/upload", upload.single("imagem"), uploadImagem); // Define uma rota POST para "/upload" que faz upload de uma imagem e chama o controlador correspondente
    app.put("/upload/:id", atualizarNovoPost);
}

export default routes; // Exporta as rotas para serem usadas em outros arquivos

