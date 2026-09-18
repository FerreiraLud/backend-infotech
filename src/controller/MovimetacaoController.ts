import type { Request, Response } from "express";
import Movimentacao from "../model/Movimentacao.js";
import type MovimentacaoDTO from "../dto/MovimentacaoDTO.js";

class MovimentacaoController {
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaDeMovimentacoes = await Movimentacao.listarMovimentacoes();

            if (listaDeMovimentacoes !== null) {
                return res.status(200).json(listaDeMovimentacoes);
            }

            return res.status(400).json({ mensagem: "Erro ao buscar a lista de movimentações." });
        } catch (error) {
            console.error(`Erro ao listar movimentações: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async MovimentacaoPorId(req: Request, res: Response): Promise<Response> {
        try {
            const id_movimentacao = Number.parseInt(req.params.id_movimentacao as string, 10);

            if (Number.isNaN(id_movimentacao)) {
                return res.status(400).json({ mensagem: "O ID da movimentação fornecido é inválido." });
            }

            const movimentacao: MovimentacaoDTO | null = await Movimentacao.listarMovimentacao(id_movimentacao);

            if (movimentacao !== null) {
                return res.status(200).json(movimentacao);
            }

            return res.status(404).json({ mensagem: "Movimentação não encontrada." });
        } catch (error) {
            console.error(`Erro ao buscar movimentação por ID: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async movimentacaoPorCodigo(req: Request, res: Response): Promise<Response> {
        try {
            const codigo = req.params.codigo as string;

            if (!codigo) {
                return res.status(400).json({ mensagem: "É necessário informar o código da movimentação." });
            }

            const movimentacao: MovimentacaoDTO | null = await Movimentacao.buscarPorCodigo(codigo);

            if (movimentacao !== null) {
                return res.status(200).json(movimentacao);
            }

            return res.status(404).json({ mensagem: "Nenhuma movimentação foi encontrada com o código fornecido." });
        } catch (error) {
            console.error(`Erro ao buscar movimentação por código: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const body = req.body ?? {};
            const {
                id_produto,
                id_movimentacao_origem,
                motivo_movimentacao,
                tipo_movimentacao,
                quantidade,
                preco_unitario,
                valor_total,
                observacao,
                data_movimentacao,
            } = body;

            const idProduto = body.idProduto ?? id_produto;
            const origem = body.idMovimentacaoOrigem ?? id_movimentacao_origem;
            const motivo = body.motivoMovimentacao ?? motivo_movimentacao;
            const tipo = body.tipoMovimentacao ?? tipo_movimentacao;
            const quantidadeMov = body.quantidade ?? quantidade;
            const precoUnitario = body.precoUnitario ?? preco_unitario;
            const valorTotal = body.valorTotal ?? valor_total;
            const observacaoMov = body.observacao ?? observacao;
            const dataMovimentacao = body.dataMovimentacao ?? data_movimentacao;

            if (!idProduto || !motivo || !tipo || quantidadeMov === undefined || precoUnitario === undefined) {
                return res.status(400).json({
                    mensagem: "Campos obrigatórios incompletos: id_produto, motivo_movimentacao, tipo_movimentacao, quantidade e preco_unitario devem ser informados."
                });
            }

            const quantidadeNum = Number(quantidadeMov);
            const precoUnitarioNum = Number(precoUnitario);
            const valorTotalNum = Number(valorTotal ?? (precoUnitarioNum * quantidadeNum));

            if (quantidadeNum < 0) {
                return res.status(400).json({ mensagem: "A quantidade não pode ser um valor negativo." });
            }

            if (precoUnitarioNum < 0) {
                return res.status(400).json({ mensagem: "O preço unitário não pode ser um valor negativo." });
            }

            if (valorTotalNum < 0) {
                return res.status(400).json({ mensagem: "O valor total não pode ser um valor negativo." });
            }

            const novaMovimentacao = new Movimentacao(
                0,
                Number(idProduto),
                origem !== undefined && origem !== null ? Number(origem) : undefined,
                String(motivo),
                String(tipo),
                quantidadeNum,
                precoUnitarioNum,
                valorTotalNum,
                observacaoMov !== undefined && observacaoMov !== null ? String(observacaoMov) : "",
                dataMovimentacao ?? new Date().toISOString(),
                true
            );

            const cadastroSucesso = await Movimentacao.cadastrarMovimentacao(novaMovimentacao);

            if (cadastroSucesso) {
                return res.status(201).json({ mensagem: "Movimentação cadastrada com sucesso!" });
            }

            return res.status(400).json({ mensagem: "Não foi possível cadastrar a movimentação no banco de dados." });
        } catch (error) {
            console.error(`Erro ao cadastrar movimentação: ${error}`);

            // Tratamento para violações de constraint (ex.: check constraint)
            // Node-postgres costuma expor `error.constraint` e `error.code` (23514 = check_violation)
            const errAny: any = error;
            if (errAny && (errAny.constraint === 'ck_movimentacao_correcao' || errAny.code === '23514' || String(errAny).includes('ck_movimentacao_correcao'))) {
                return res.status(400).json({ mensagem: "Violação de regra ao cadastrar movimentação: ck_movimentacao_correcao.", detalhe: errAny.message ?? String(errAny) });
            }

            return res.status(500).json({ mensagem: "Erro interno no servidor.", detalhe: error instanceof Error ? error.message : String(error) });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const id_movimentacao = Number.parseInt(req.params.id_movimentacao as string, 10);

            if (Number.isNaN(id_movimentacao)) {
                return res.status(400).json({ mensagem: "O ID da movimentação fornecido é inválido." });
            }

            const removido = await Movimentacao.removerMovimentacao(id_movimentacao);

            if (removido) {
                return res.status(200).json({ mensagem: "Movimentação removida com sucesso do sistema." });
            }

            return res.status(400).json({ mensagem: "Não foi possível remover a movimentação. Verifique se ela existe." });
        } catch (error) {
            console.error(`Erro ao remover movimentação: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const id_movimentacao = Number.parseInt(req.params.id_movimentacao as string, 10);
            const {
                id_produto,
                id_movimentacao_origem,
                motivo_movimentacao,
                tipo_movimentacao,
                quantidade,
                preco_unitario,
                valor_total,
                observacao,
                data_movimentacao,
            } = req.body;

            if (Number.isNaN(id_movimentacao)) {
                return res.status(400).json({ mensagem: "O ID da movimentação fornecido é inválido." });
            }

            if (quantidade !== undefined && Number(quantidade) < 0) {
                return res.status(400).json({ mensagem: "A quantidade não pode ser um valor negativo." });
            }

            if (preco_unitario !== undefined && Number(preco_unitario) < 0) {
                return res.status(400).json({ mensagem: "O preço unitário não pode ser um valor negativo." });
            }

            if (valor_total !== undefined && Number(valor_total) < 0) {
                return res.status(400).json({ mensagem: "O valor total não pode ser um valor negativo." });
            }

            const movimentacaoAtualizar = new Movimentacao(
                id_movimentacao,
                id_produto !== undefined ? Number(id_produto) : 0,
                id_movimentacao_origem !== undefined && id_movimentacao_origem !== null ? Number(id_movimentacao_origem) : undefined,
                motivo_movimentacao !== undefined ? String(motivo_movimentacao) : "",
                tipo_movimentacao !== undefined ? String(tipo_movimentacao) : "",
                quantidade !== undefined ? Number(quantidade) : 0,
                preco_unitario !== undefined ? Number(preco_unitario) : 0,
                valor_total !== undefined ? Number(valor_total) : 0,
                observacao !== undefined ? String(observacao) : "",
                data_movimentacao ?? new Date().toISOString(),
                true
            );

            const atualizado = await Movimentacao.atualizarMovimentacao(movimentacaoAtualizar);

            if (atualizado) {
                return res.status(200).json({ mensagem: "Movimentação atualizada com sucesso!" });
            }

            return res.status(400).json({ mensagem: "Não foi possível atualizar a movimentação. Verifique se ela existe ou está ativa." });
        } catch (error) {
            console.error(`Erro ao atualizar movimentação: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }
}

export default MovimentacaoController;