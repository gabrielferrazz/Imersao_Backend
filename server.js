
import express from "express"; // Importa o framework Express para criar e gerenciar o servidor
import routes from "./src/routes/postsRoutes.js"; // Importa as rotas para criar e gerenciar o servidor

const app = express(); // Cria uma instância do aplicativo Express
app.use(express.static("uploads"));
routes(app);

// Configura o servidor para escutar na porta 3000 e exibe uma mensagem no console
app.listen(3000, () => {
    console.log("Servidor Escutando");
});
