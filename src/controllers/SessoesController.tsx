import { Request, Response } from 'express';
import Sessao from '../models/sessoes';// Certifique-se que o caminho e a nomenclatura estejam corretos

class SessionController {
  // Listar todas as sessões
  async index(req: Request, res: Response) {
    try {
      const sessoes = await Sessao.findAll({
        include: ['praticanteData', 'profissionalData'], // Inclui dados relacionados, se necessário
      });
      res.json(sessoes);
    } catch (err) {

      return res.status(500).json({ error: err.message });
    }
  }


  async showbypraticante(req: Request, res: Response) {
    const id = req.params.id;
    console.log("id do praticante->", id);

    try {
      const ultimaSessao = await Sessao.findOne({
        where: { id_praticante: id },
        order: [['created_at', 'DESC']], // Ordena pela data de criação em ordem decrescente
      });

      const numero = ultimaSessao.dataValues.numero_sessoes;
      console.log(`Número da última sessão: ${numero}`);
      const proximoNumeroSessao = numero + 1;

      console.log(`Próximo número da sessão: ${proximoNumeroSessao}`);
      const dados = ultimaSessao.dataValues;

      return res.status(200).json({proximoNumeroSessao, dados});
    } catch (err) {
      console.error('Erro ao buscar sessões:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const sessao = await Sessao.findByPk(id, {
        include: ['praticanteData', 'profissionalData'],
      });
      if (!sessao) {
        return res.status(404).json({ error: 'Sessão não encontrada' });
      } else {
        return res.json(sessao);
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Criar uma nova sessão
  async store(req: Request, res: Response) {
    const { praticante, profissional, dia_semana, horario_sessao, turno,hora_fim, tempo_duracao, obs, id_praticante, id_profissional } = req.body;

    try {
      // Validar campos obrigatórios
      if (!praticante || !profissional || !dia_semana || !id_praticante || !id_profissional) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }

      const newSession = await Sessao.create({
        praticante,
        profissional,
        dia_semana,
        horario_sessao,
        hora_fim,
        turno,
        tempo_duracao,
        obs,
        id_praticante,
        id_profissional,
        numero_sessoes: 0,
      });

      console.log('Sessão criada com sucesso', newSession);
      return res.status(201).json(newSession);
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      console.error('Erro ao criar sessão:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  //criar uma nova sessao a partir da ficha de frequencia 
  async storeFromFrequency(req: Request, res: Response) {
    const { id_praticante, id_profissional, dia_semana, tempo_duracao, obs } = req.body;

    try {
      // Validar campos obrigatórios
      if (!id_praticante || !id_profissional || !dia_semana) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }

      const newSession = await Sessao.create({
        dia_semana,
        tempo_duracao,
        obs,
        id_praticante,
        id_profissional,
      });

      console.log('Sessão criada com sucesso', newSession);
      return res.status(201).json(newSession);
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Atualizar uma sessão existente
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { praticante, profissional, dia_semana,horario_sessao, hora_fim,turno, tempo_duracao, obs, id_praticante, id_profissional } = req.body;

    try {
      const sessao = await Sessao.findByPk(id);
      console.log('Sessão:', sessao);
      if (!sessao) {
        return res.status(404).json({ error: 'Sessão não encontrada' });
      }

      await sessao.update({
        praticante,
        profissional,
        dia_semana,
        horario_sessao,
        turno,
        hora_fim,
        tempo_duracao,
        obs,
        id_praticante,
        id_profissional,
      });

      console.log('Sessão atualizada com sucesso', sessao);

      return res.json(sessao);
    } catch (err) {
      console.error('Erro ao atualizar sessão:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Deletar uma sessão
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const sessao = await Sessao.findByPk(id);

      if (!sessao) {
        return res.status(404).json({ error: 'Sessão não encontrada' });
      }

      await sessao.destroy();

      return res.json({ message: 'Sessão deletada com sucesso' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new SessionController();
