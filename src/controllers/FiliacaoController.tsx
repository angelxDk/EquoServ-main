import Filiacao from "../models/filiacao";
import { Request, Response } from "express";

class FiliacaoController {
  async index(req: Request, res: Response) {
    try {
      const Filiacoes = await Filiacao.findAll();
      res.json(Filiacoes);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const filiacao = await Filiacao.findAll({ where: { praticante_id: id } });
      if (!filiacao || filiacao.length === 0) {
        return res.status(404).json({ error: "Filiação não encontrada" });
      }
      return res.json(filiacao);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async store(req: Request, res: Response) {
    let {
      nome_responsavel,
      parentesco,
      telefone_responsavel,
      endereco,
      praticante_id,
      numero,
      bairro,
      cidade,
      estado,
      cep,
      digital
    } = req.body;

    digital = digital ? 'sim' : 'nao';

    try {
      const newFiliacao = await Filiacao.create({
        nome_responsavel,
        parentesco,
        telefone_responsavel,
        endereco,
        praticante_id,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        digital
      });

      return res.status(201).json(newFiliacao);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }


  async update(req: Request, res: Response) {
    const { id } = req.params;
    console.log("updated id-> ",id);
    let {
      nome_responsavel,
      parentesco,
      telefone_responsavel,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      cep,
      digital
    } = req.body;
    console.log("updated body-> ",req.body);
    digital = digital ? 'sim' : 'nao';
    try {
      const filiacao = await Filiacao.findByPk(id);
      if (!filiacao) {
        return res.status(404).json({ error: "Filiação não encontrada" });
      }
      await filiacao.update({
        nome_responsavel,
        parentesco,
        telefone_responsavel,
        endereco,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        digital
      });
      return res.status(200).json(filiacao);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const filiacao = await Filiacao.findByPk(id);
      if (!filiacao) {
        return res.status(404).json({ error: "Filiação não encontrada" });
      }
      await filiacao.destroy();
      return res.status(200).json({ message: "Filiação deletada com sucesso" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new FiliacaoController();
