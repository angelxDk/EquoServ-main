import { Request, Response } from 'express';
import Receitas from '../models/receitas';
import { Op } from 'sequelize';

class ReceitasController {
  async index(req: Request, res: Response) {
    try {
      const receitas = await Receitas.findAll();
      return res.json(receitas);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const receita = await Receitas.findByPk(id);
      if (!receita) {
        return res.status(404).json({ error: 'Receita não encontrada' });
      }
      return res.status(200).json(receita);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const { mes_referencia_id, descricao, valor, observacoes } = req.body;
      if (!mes_referencia_id || !descricao || !valor) {
        return res.status(400).json({ error: 'Mês de referência, descrição e valor são obrigatórios' });
      }
      const receita = await Receitas.create({
        mes_referencia_id,
        descricao,
        valor,
        observacoes,
      });
      return res.status(201).json({ message: 'Receita criada com sucesso!', receita });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { mes_referencia_id, descricao, valor, observacoes } = req.body;
    try {
      const receita = await Receitas.findByPk(id);
      if (!receita) {
        return res.status(404).json({ error: 'Receita não encontrada' });
      }
      receita.mes_referencia_id = mes_referencia_id || receita.mes_referencia_id;
      receita.descricao = descricao || receita.descricao;
      receita.valor = valor || receita.valor;
      receita.observacoes = observacoes || receita.observacoes;
      await receita.save();
      return res.status(200).json({ message: 'Receita atualizada com sucesso!', receita });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const receita = await Receitas.findByPk(id);
      if (!receita) {
        return res.status(404).json({ error: 'Receita não encontrada' });
      }
      await receita.destroy();
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async search(req: Request, res: Response) {
    const { searchTerm } = req.query;
    try {
      const results = await Receitas.findAll({
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

export default new ReceitasController();
