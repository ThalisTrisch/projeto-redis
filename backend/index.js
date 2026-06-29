const express = require('express');
const cors = require('cors');
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 1000;

app.use(cors({
    origin: 'http://localhost:3000', // origem padrão do Vite (React)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configuração do cliente Redis
const client = createClient({
    username: 'default',
    password: 'hCn1nSZyPg8QxtrXmYsaWO19NbeTtro0',
    socket: {
        host: 'balletic-bucket-umbrous-42918.db.redis.io',
        port: 15608
    }
});

client.on('error', (err) => console.error('Redis Client Error:', err));

client.connect()
    .then(() => console.log('Conectado ao Redis'))
    .catch(console.error);

// -------------------------------------------------------
// ROTAS
// -------------------------------------------------------

// GET / — health check simples
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor rodando' });
});



// POST /set — armazena uma chave com valor e TTL opcional
// Body: { "key": "nome", "value": "valor", "ttl": 60 }
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const key = `auth:${email}`;
    const value = JSON.stringify({ email, senha });
    const ttl = 60;

    if (!email || !senha) {
        return res.status(400).json({ error: 'email e senha são obrigatórios' });
    }

    try {
        await client.set(key, value, { EX: ttl });
        res.json({ message: `Sessão criada para "${email}"`, ttl });
    } catch (err) {
        console.error('[/login] Erro:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /get/:key — busca o valor de uma chave
app.get('/get/:key', async (req, res) => {
    const { key } = req.params;

    try {
        const value = await client.get(key);
        if (value === null) {
            return res.status(404).json({ error: `Chave "${key}" não encontrada ou expirada` });
        }
        res.json({ key, value });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /del/:key — remove uma chave
app.delete('/del/:key', async (req, res) => {
    const { key } = req.params;

    try {
        const deleted = await client.del(key);
        if (deleted === 0) {
            return res.status(404).json({ error: `Chave "${key}" não encontrada` });
        }
        res.json({ message: `Chave "${key}" removida` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /ttl/:key — verifica quanto tempo resta para uma chave expirar
app.get('/ttl/:key', async (req, res) => {
    const { key } = req.params;

    try {
        const ttl = await client.ttl(key);
        if (ttl === -2) {
            return res.json({ ttl, expirou: true });
        } else {
            return res.json({ ttl, expirou: false });
        }
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/getCarrinho/:idUsuario', async (req, res) => {
    const idUsuario = req.params.idUsuario;
    const key = `carrinho:${idUsuario}`; 
    try {
        const resultadoRedis = await client.get(key);
        if (!resultadoRedis) {
            return res.json({
                message: 'O carrinho está vazio.',
                produtos: []
            });
        }
        const produtosDoCarrinho = JSON.parse(resultadoRedis);
        res.json({
            message: 'Carrinho recuperado com sucesso.',
            usuario: idUsuario,
            produtos: produtosDoCarrinho
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /register — verifica se o usuário já existe; se não, grava em user: sem TTL
app.post('/register', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'email e senha são obrigatórios' });
    }

    const key = `user:${email}`;

    try {
        const existe = await client.get(key);

        if (existe) {
            return res.status(409).json({ error: 'Usuário já cadastrado', exists: true });
        }

        // Sem TTL — o registro fica permanente no Redis
        await client.set(key, JSON.stringify({ email, senha }));

        res.status(201).json({ message: 'Usuário cadastrado com sucesso', key });
    } catch (err) {
        console.error('[/register] Erro:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /carrinho — adiciona um produto ao carrinho do usuário
// Body: { "email": "user@email.com", "produtoId": 42 }
app.post('/carrinho', async (req, res) => {
    const { email, produtoId } = req.body;

    if (!email || produtoId === undefined) {
        return res.status(400).json({ error: 'email e produtoId são obrigatórios' });
    }

    const key = `user:${email}`;

    try {
        const dados = await client.get(key);

        if (!dados) {
            return res.status(404).json({ error: `Usuário "${email}" não encontrado` });
        }

        const usuario = JSON.parse(dados);

        // Garante que o campo carrinho existe e é uma lista
        if (!Array.isArray(usuario.carrinho)) {
            usuario.carrinho = [];
        }

        // Adiciona o id só se ainda não estiver no carrinho
        if (!usuario.carrinho.includes(produtoId)) {
            usuario.carrinho.push(produtoId);
        }

        // Grava de volta sem TTL
        await client.set(key, JSON.stringify(usuario));

        res.json({
            message: 'Produto adicionado ao carrinho',
            email,
            carrinho: usuario.carrinho
        });
    } catch (err) {
        console.error('[/carrinho] Erro:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /carrinho/:email — retorna o carrinho do usuário
app.get('/carrinho/:email', async (req, res) => {
    const { email } = req.params;
    const key = `user:${email}`;

    try {
        const dados = await client.get(key);

        if (!dados) {
            return res.status(404).json({ error: `Usuário "${email}" não encontrado` });
        }

        const usuario = JSON.parse(dados);

        res.json({
            email,
            carrinho: usuario.carrinho || []
        });
    } catch (err) {
        console.error('[/carrinho GET] Erro:', err);
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------------------------------

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
