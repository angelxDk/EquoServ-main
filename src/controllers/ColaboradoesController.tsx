import { Request, Response } from 'express';
import Colaboradores from '../models/colaboradores';
import { Op } from 'sequelize';

class ColaboradoesController {
  async index(req: Request, res: Response) {
    try {
      const colaboradores = await Colaboradores.findAll();
      return res.json(colaboradores);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const colaborador = await Colaboradores.findByPk(id);
      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador não encontrado' });
      }
      return res.status(200).json(colaborador);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const { nome } = req.body;
      if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }
      const colaborador = await Colaboradores.create({ nome });
      return res.status(201).json({ message: 'Colaborador criado com sucesso!', colaborador });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome } = req.body;
    try {
      const colaborador = await Colaboradores.findByPk(id);
      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador não encontrado' });
      }
      colaborador.nome = nome || colaborador.nome;
      await colaborador.save();
      return res.status(200).json({ message: 'Colaborador atualizado com sucesso!', colaborador });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const colaborador = await Colaboradores.findByPk(id);
      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador não encontrado' });
      }
      await colaborador.destroy();
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async search(req: Request, res: Response) {
    const { searchTerm } = req.query;
    try {
      const results = await Colaboradores.findAll({
        where: { nome: { [Op.iLike]: `%${searchTerm}%` } },
      });
      return res.status(200).json(results);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new ColaboradoesController();
