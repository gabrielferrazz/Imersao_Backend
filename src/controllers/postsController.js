import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função para listar todos os posts
export async function listarPosts(req, res) {
    try {
        const posts = await getTodosPosts(); // Obtém os posts do banco de dados

        // Atualiza os URLs das imagens com a BASE_URL
        const baseUrl = process.env.BASE_URL;
        const updatedPosts = posts.map(post => {
            return {
                ...post,
                imagemUrl: `${baseUrl}/${post._id}.png`
            };
        });

        res.status(200).json(updatedPosts); // Retorna os posts atualizados
    } catch (error) {
        console.error("Erro ao listar posts:", error.message);
        res.status(500).json({ erro: "Erro ao listar posts" });
    }
}

// Função para criar um novo post
export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch (error) {
        console.error("Erro ao criar post:", error.message);
        res.status(500).json({ erro: "Erro ao criar post" });
    }
}

// Função para fazer upload de uma imagem e criar um post
export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imagemUrl: "",
        alt: ""
    };

    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, imagemAtualizada); // Move o arquivo para o destino correto

        // Atualiza o post com a URL correta da imagem
        const baseUrl = process.env.BASE_URL;
        const updatedPost = {
            imagemUrl: `${baseUrl}/${postCriado.insertedId}.png`
        };

        await atualizarPost(postCriado.insertedId, updatedPost);

        res.status(200).json({ ...postCriado, ...updatedPost });
    } catch (error) {
        console.error("Erro ao fazer upload de imagem:", error.message);
        res.status(500).json({ erro: "Erro ao fazer upload de imagem" });
    }
}

// Função para atualizar um post
export async function atualizarNovoPost(req, res) {
    const id = req.params.id;

    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imageBuffer);

        const baseUrl = process.env.BASE_URL;
        const updatedPost = {
            imagemUrl: `${baseUrl}/${id}.png`,
            descricao: descricao,
            alt: req.body.alt || ""
        };

        const postAtualizado = await atualizarPost(id, updatedPost);

        res.status(200).json(postAtualizado);
    } catch (error) {
        console.error("Erro ao atualizar post:", error.message);
        res.status(500).json({ erro: "Erro ao atualizar post" });
    }
}
