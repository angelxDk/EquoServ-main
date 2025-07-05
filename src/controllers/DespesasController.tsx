import { Request, Response } from 'express';
import Despesas from '../models/despesas';
import { Op } from 'sequelize';

class DespesasController {
  async index(req: Request, res: Response) {
    try {
      const despesas = await Despesas.findAll();
      return res.json(despesas);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const despesa = await Despesas.findByPk(id);
      if (!despesa) {
        return res.status(404).json({ error: 'Despesa não encontrada' });
      }
      return res.status(200).json(despesa);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const { mes_referencia_id, colaborador_id, valor, descricao, observacoes } = req.body;
      if (!mes_referencia_id || !valor) {
        return res.status(400).json({ error: 'Mes de referência e valor são obrigatórios' });
      }
      const despesa = await Despesas.create({
        mes_referencia_id,
        colaborador_id,
        valor,
        descricao,
        observacoes,
      });
      return res.status(201).json({ message: 'Despesa criada com sucesso!', despesa });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { mes_referencia_id, colaborador_id, valor, descricao, observacoes } = req.body;
    try {
      const despesa = await Despesas.findByPk(id);
      if (!despesa) {
        return res.status(404).json({ error: 'Despesa não encontrada' });
      }
      despesa.mes_referencia_id = mes_referencia_id || despesa.mes_referencia_id;
      despesa.colaborador_id = colaborador_id || despesa.colaborador_id;
      despesa.valor = valor || despesa.valor;
      despesa.descricao = descricao || despesa.descricao;
      despesa.observacoes = observacoes || despesa.observacoes;
      await despesa.save();
      return res.status(200).json({ message: 'Despesa atualizada com sucesso!', despesa });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const despesa = await Despesas.findByPk(id);
      if (!despesa) {
        return res.status(404).json({ error: 'Despesa não encontrada' });
      }
      await despesa.destroy();
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async search(req: Request, res: Response) {
    const { searchTerm } = req.query;
    try {
      const results = await Despesas.findAll({
        where: {
          descricao: { [Op.iLike]: `%${searchTerm}%` },
        },
      });
      return res.status(200).json(results);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new DespesasController();
