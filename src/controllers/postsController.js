import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Obtém a URL base do ambiente (produção ou local)
const baseURL = process.env.BASE_URL || "http://localhost:3000"; 

export async function listarPosts(req, res) {
    try {
        const posts = await getTodosPosts(); // Obtém os posts do banco de dados usando a função definida

        // Atualiza os posts para incluir a URL completa da imagem
        const updatedPosts = posts.map(post => ({
            ...post,
            imagemUrl: `${baseURL}/uploads/${post.imagemUrl}`,
        }));

        res.status(200).json(updatedPosts); // Responde à requisição com os dados atualizados
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ "Erro": "Falha ao listar posts" });
    }
}

export async function postarNovoPost(req, res) {
    const novoPost = req.body; // Obtém os dados do novo post enviados no corpo da requisição
    try {
        const postCriado = await criarPost(novoPost); // Cria um novo post no banco de dados
        res.status(200).json(postCriado); // Retorna o post criado com sucesso
    } catch (error) {
        console.error(error.message); // Exibe o erro no console em caso de falha
        res.status(500).json({ "Erro": "Falha ao criar novo post" });
    }
}

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "", // Inicializa a descrição como uma string vazia
        imagemUrl: req.file.originalname, // Define o nome original do arquivo como URL da imagem
        alt: "" // Inicializa o texto alternativo como uma string vazia
    };
    try {
        const postCriado = await criarPost(novoPost); // Cria o novo post no banco de dados
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`; // Define o novo caminho para o arquivo usando o ID do post criado
        fs.renameSync(req.file.path, imagemAtualizada); // Renomeia/move o arquivo para o novo caminho especificado

        // Atualiza a URL da imagem com o domínio correto
        postCriado.imagemUrl = `${baseURL}/${imagemAtualizada}`;

        res.status(200).json(postCriado); // Retorna o post criado com a URL atualizada
    } catch (error) {
        console.error(error.message); // Exibe o erro no console em caso de falha
        res.status(500).json({ "Erro": "Falha ao fazer upload da imagem" });
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;

    // Gera a URL completa para a imagem
    const urlImagem = `${baseURL}/uploads/${id}.png`;

    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imageBuffer); // Gera uma descrição para a imagem

        const post = {
            imagemUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt // Obtém o texto alternativo enviado no corpo da requisição
        };

        const postCriado = await atualizarPost(id, post);

        res.status(200).json(postCriado); // Retorna o post atualizado com sucesso
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ "Erro": "Falha ao atualizar o post" });
    }
}
