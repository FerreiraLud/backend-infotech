import { Router } from "express";
import CategoriaController from "./controller/CategoriaController.js";
import ProdutoController from "./controller/ProdutoController.js";
import MovimentacaoController from "./controller/MovimetacaoController.js";

const router = Router();

router.post("/api/login", (req, res) => {
  const { email, senha } = req.body;

  if (email === "admin@email.com.br" && senha === "123") {
    return res.status(200).json({
      auth: true,
      token: "jwt-token-fake-123456",
      usuario: {
        id_usuario: 1,
        nome: "Administrador",
        email,
        role: "admin"
      },
      message: "Login realizado com sucesso"
    });
  }

  return res.status(401).json({
    auth: false,
    message: "Credenciais inválidas"
  });
});

router.get("/categorias", CategoriaController.todos);
router.get("/categorias/:id_categoria", CategoriaController.categoriaPorId);
router.get("/categorias/buscar/:nome", CategoriaController.categoriaPorNome);
router.post("/categorias", CategoriaController.novo);
router.put("/categorias/:id_categoria", CategoriaController.atualizar);
router.delete("/categorias/:id_categoria", CategoriaController.remover);

router.get("/produtos", ProdutoController.todos);
router.get("/produtos/:id_produto", ProdutoController.produtoPorId);
router.get("/produtos/buscar/:codigo", ProdutoController.produtoPorCodigo);
router.post("/produtos", ProdutoController.novo);
router.put("/produtos/:id_produto", ProdutoController.atualizar);
router.delete("/produtos/:id_produto", ProdutoController.remover);

router.get("/movimentacoes", MovimentacaoController.todos);
router.get("/movimentacoes/:id_movimentacao", MovimentacaoController.MovimentacaoPorId);
router.get("/movimentacoes/buscar/:codigo", MovimentacaoController.movimentacaoPorCodigo);
router.post("/movimentacoes", MovimentacaoController.novo);
router.put("/movimentacoes/:id_movimentacao", MovimentacaoController.atualizar);
router.delete("/movimentacoes/:id_movimentacao", MovimentacaoController.remover);

export { router };