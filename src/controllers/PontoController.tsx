import { Request, Response } from "express";
import Funcionario from "../models/funcionario";
import Ponto from "../models/ponto";

class PontoController {
  async index(req: Request, res: Response) {
    try {
      const pontos = await Ponto.findAll();
      return res.json(pontos);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
  async store(req: Request, res: Response) {
    const data  = req.body;
    try {
      const funcionario = await Funcionario.findByPk(data.id_funcionario);
      if (!funcionario) {
        return res.status(404).json({ error: "Funcionário não encontrado." });
      }
      // Cria um novo ponto
      const novoPonto = await Ponto.create({
        nome_funcionario: funcionario.dataValues.nome,
        id_funcionario: data.id_funcionario,
        data_horario: data.data_horario,
      });
      return res.status(200).json(novoPonto);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}

export default new PontoController();
