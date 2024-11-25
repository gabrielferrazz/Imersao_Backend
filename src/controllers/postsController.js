import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js"

export async function listarPosts(req, res) {
    const posts = await getTodosPosts();  // Obtém os posts do banco de dados usando a função definida
    res.status(200).json(posts);  // Responde à requisição com os dados no formato JSON e status 200 (OK)
}
export async function postarNovoPost(req, res) {
    const novoPost = req.body; // Obtém os dados do novo post enviados no corpo da requisição
    try {
        const postCriado = await criarPost(novoPost); // Chama a função para criar um novo post no banco de dados
        res.status(200).json(postCriado); // Retorna o post criado com o status 200 (OK) em formato JSON
    } catch (error) {
        console.error(error.message); // Exibe o erro no console em caso de falha
        res.status(500).json({ "Erro": "Falha na Requisicao" }); // Retorna um erro genérico com status 500 (Erro no servidor)
    }
}

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "", // Inicializa a descrição como uma string vazia
        imagemUrl: req.file.originalname, // Define o nome original do arquivo como URL da imagem
        alt: "" // Inicializa o texto alternativo como uma string vazia
    }
    try {
        const postCriado = await criarPost(novoPost); // Cria o novo post no banco de dados
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`; // Define o novo caminho para o arquivo usando o ID do post criado
        fs.renameSync(req.file.path, imagemAtualizada); // Renomeia/move o arquivo para o novo caminho especificado
        res.status(200).json(postCriado); // Retorna o post criado com o status 200 (OK) em formato JSON
    } catch (error) {
        console.error(error.message); // Exibe o erro no console em caso de falha
        res.status(500).json({ "Erro": "Falha na Requisicao" }); // Retorna um erro genérico com status 500 (Erro no servidor)
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`

    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imageBuffer);

        const post = {
            imagemUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);

        res.status(200).json(postCriado); 
    } catch (error) {
        console.error(error.message); 
        res.status(500).json({ "Erro": "Falha na Requisicao" }); 
    }
}

