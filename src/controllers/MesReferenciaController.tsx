import { Request, Response } from 'express';
import MesReferencia from '../models/mesreferencia';
import { Op } from 'sequelize';

class MesReferenciaController {
  async index(req: Request, res: Response) {
    try {
      const mesesReferencia = await MesReferencia.findAll();
      return res.json(mesesReferencia);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const mesReferencia = await MesReferencia.findByPk(id);
      if (!mesReferencia) {
        return res.status(404).json({ error: 'Mês de referência não encontrado' });
      }
      return res.status(200).json(mesReferencia);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const { mes, ano, saldo_inicial, saldo_final } = req.body;
      if (!mes || !ano) {
        return res.status(400).json({ error: 'Mês e ano são obrigatórios' });
      }
      const mesReferencia = await MesReferencia.create({
        mes,
        ano,
        saldo_inicial: saldo_inicial || 0,
        saldo_final: saldo_final || 0,
      });
      return res.status(201).json({ message: 'Mês de referência criado com sucesso!', mesReferencia });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { mes, ano, saldo_inicial, saldo_final } = req.body;
    try {
      const mesReferencia = await MesReferencia.findByPk(id);
      if (!mesReferencia) {
        return res.status(404).json({ error: 'Mês de referência não encontrado' });
      }
      mesReferencia.mes = mes || mesReferencia.mes;
      mesReferencia.ano = ano || mesReferencia.ano;
      mesReferencia.saldo_inicial = saldo_inicial || mesReferencia.saldo_inicial;
      mesReferencia.saldo_final = saldo_final || mesReferencia.saldo_final;
      await mesReferencia.save();
      return res.status(200).json({ message: 'Mês de referência atualizado com sucesso!', mesReferencia });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const mesReferencia = await MesReferencia.findByPk(id);
      if (!mesReferencia) {
        return res.status(404).json({ error: 'Mês de referência não encontrado' });
      }
      await mesReferencia.destroy();
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async search(req: Request, res: Response) {
    const { mes, ano } = req.query;
    try {
      const results = await MesReferencia.findAll({
        where: {
          ...(mes && { mes: { [Op.eq]: mes } }),
          ...(ano && { ano: { [Op.eq]: ano } }),
        },
      });
      return res.status(200).json(results);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new MesReferenciaController();
