import * as express from 'express';
import cors = require('cors');
import CategoriaController from "./controller/CategoriaController.js";
import ProdutoController from "./controller/ProdutoController.js";
import MovimentacaoController from "./controller/MovimetacaoController.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Habilita o CORS para permitir requisições do frontend (localhost:5173)
app.use(cors({
  origin: '*', // Permite acessos de qualquer origem no ambiente de desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para processar JSON
app.use(express.json());

// Rota de Login (Simulação/Exemplo de autenticação)
app.post("/api/login", (req, res) => {
  const { email, senha } = req.body;

  // Lógica de validação básica (pode conectar com o controller/banco de dados)
  if (email === 'admin@email.com.br' && senha === '123') {
    return res.status(200).json({
      auth: true,
      token: 'jwt-token-fake-123456',
      usuario: {
        id_usuario: 1,
        nome: 'Administrador',
        email: email,
        role: 'admin'
      },
      message: 'Login realizado com sucesso'
    });
  }

  return res.status(401).json({
    auth: false,
    message: 'Credenciais inválidas'
  });
});

// Rotas de Categoria
app.get("/categorias", CategoriaController.todos);
app.get("/categorias/:id_categoria", CategoriaController.categoriaPorId);
app.get("/categorias/buscar/:nome", CategoriaController.categoriaPorNome);
app.post("/categorias", CategoriaController.novo);
app.put("/categorias/:id_categoria", CategoriaController.atualizar);
app.delete("/categorias/:id_categoria", CategoriaController.remover);

// Rotas de Produto
app.get("/produtos", ProdutoController.todos);
app.get("/produtos/:id_produto", ProdutoController.produtoPorId);
app.get("/produtos/buscar/:codigo", ProdutoController.produtoPorCodigo);
app.post("/produtos", ProdutoController.novo);
app.put("/produtos/:id_produto", ProdutoController.atualizar);
app.delete("/produtos/:id_produto", ProdutoController.remover);

// Rotas de Movimentação
app.get("/movimentacoes", MovimentacaoController.todos);
app.get("/movimentacoes/:id_movimentacao", MovimentacaoController.MovimentacaoPorId);
app.get("/movimentacoes/buscar/:codigo", MovimentacaoController.movimentacaoPorCodigo);
app.post("/movimentacoes", MovimentacaoController.novo);
app.put("/movimentacoes/:id_movimentacao", MovimentacaoController.atualizar);
app.delete("/movimentacoes/:id_movimentacao", MovimentacaoController.remover);

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});