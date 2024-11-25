import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbconfig.js"; // Importa a função de conexão com o banco de dados definida em "dbconfig.js"

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO); // Realiza a conexão com o banco de dados usando a string de conexão do ambiente

// Função assíncrona para buscar todos os posts do banco de dados
export async function getTodosPosts() {
    const db = conexao.db("Imersao-instabytes"); // Obtém a referência ao banco de dados específico
    const colecao = db.collection("posts"); // Acessa a coleção "posts" dentro do banco
    return colecao.find().toArray(); // Retorna todos os documentos da coleção como um array
}

export async function criarPost(novoPost) {
    const db = conexao.db("Imersao-instabytes"); // Obtém a conexão com o banco de dados "Imersao-instabytes"
    const colecao = db.collection("posts"); // Acessa a coleção "posts" dentro do banco de dados
    return colecao.insertOne(novoPost); // Insere o novo post na coleção e retorna o resultado da operação
}

export async function atualizarPost(id, novoPost) {
    const db = conexao.db("Imersao-instabytes");
    const colecao = db.collection("posts");
    const objectID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objectID)}, {$set:novoPost});
}

