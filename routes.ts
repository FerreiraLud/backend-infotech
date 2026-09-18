import { Router, type Request, type Response } from "express";

import ProdutoController from "./src/controller/ProdutoController.js";
import MovimetacaoController from "./src/controller/MovimetacaoController.js";


const router = Router();


router.get('/', (req: Request, res: Response) => {
    return res
        .status(200) // Status HTTP 200 (OK)
        .json(`Aplicação online. Timestamp: ${new Date()}`);
});

router.post('/api/login', (req: Request, res: Response) => {
    const body = req.body ?? {};
    const email = body.email ?? body.login ?? body.username;
    const senha = body.senha ?? body.password;

    if (!email || !senha) {
        return res.status(400).json({
            message: "Email e senha são obrigatórios."
        });
    }

    return res.status(200).json({
        message: "Login realizado com sucesso",
        token: "dev-token",
        user: {
            email,
        }
    });
});

router.get('/api/produtos', ProdutoController.todos);
router.get('/api/produtos/codigo/:codigo', ProdutoController.produtoPorCodigo);
router.get('/api/produtos/:id_produto', ProdutoController.produtoPorId);
router.post('/api/produtos', ProdutoController.novo);
router.delete('/api/produtos/:id_produto', ProdutoController.remover);
router.put('/api/produtos/:id_produto', ProdutoController.atualizar);

router.get('/api/movimentacoes', MovimetacaoController.todos);
router.get('/api/movimentacoes/codigo/:codigo', MovimetacaoController.movimentacaoPorCodigo);
router.get('/api/movimentacoes/:id_movimentacao', MovimetacaoController.MovimentacaoPorId);
router.post('/api/movimentacoes', MovimetacaoController.novo);
router.delete('/api/movimentacoes/:id_movimentacao', MovimetacaoController.remover);
router.put('/api/movimentacoes/:id_movimentacao', MovimetacaoController.atualizar);

router.get('/api/movimentacao', MovimetacaoController.todos);
router.get('/api/movimentacao/codigo/:codigo', MovimetacaoController.movimentacaoPorCodigo);
router.get('/api/movimentacao/:id_movimentacao', MovimetacaoController.MovimentacaoPorId);
router.post('/api/movimentacao', MovimetacaoController.novo);
router.delete('/api/movimentacao/:id_movimentacao', MovimetacaoController.remover);
router.put('/api/movimentacao/:id_movimentacao', MovimetacaoController.atualizar);


export { router };