import { Request, Response } from "express";
import Frequencia from "../models/frequencia";
import Filiacao from "../models/filiacao";
import { Op, literal } from "sequelize";

class FrequenciaController {
  async index(req: Request, res: Response) {
    try {
      const frequencias = await Frequencia.findAll();
      res.status(200).json(frequencias);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  async indexById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const frequencias = await Frequencia.findAll({
        where: {
          id_praticante: id,
        },
      });
      res.status(200).json(frequencias);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const foundFrequencia = await Frequencia.findByPk(id);
      if (!foundFrequencia) {
        return res.status(404).json({ error: "Frequência não encontrada" });
      }
      return res.json(foundFrequencia);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async store(req, res) {
    let {
      praticante_nome,
      profissional_nome,
      turno,
      numero_sessao,
      data,
      presenca,
      justificativa,
      id_fisioterapeuta,
      id_praticante,
      horario,
      digital, // Digital recebida no request
    } = req.body;
    digital = digital ? "sim" : "nao"; // Verifica se o digital é 'sim' ou 'nao'
    console.log("Dados recebidos na requisição: ", req.body);
    try {
      const novaFrequencia = await Frequencia.create({
        praticante_nome,
        profissional_nome,
        turno,
        numero_sessao,
        data,
        presenca,
        justificativa,
        id_fisioterapeuta,
        id_praticante,
        horario,
        digital, // Adiciona o digital ao registro
      });
      console.log("Registro de frequência criado com sucesso", novaFrequencia);
      return res.status(200).json(novaFrequencia);
    } catch (err) {
      console.error("Erro ao processar a requisição: ", err);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  async frequenciaMensal(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mesAnterior = hoje.getMonth() - 1;

      const primeiroDia = new Date(ano, mesAnterior, 1);
      const ultimoDia = new Date(ano, mesAnterior + 1, 0);

      // Formata para 'YYYY-MM-DD' (evita problemas com fuso/hora)
      const formatData = (d: Date): string => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dia = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${dia}`;
      };

      const primeiroDiaFormatado = formatData(primeiroDia);
      const ultimoDiaFormatado = formatData(ultimoDia);

      console.log(
        `Calculando frequência do mês passado para o praticante ${id} entre ${primeiroDiaFormatado} e ${ultimoDiaFormatado}`
      );

      const frequencias = await Frequencia.findAll({
        where: {
          id_praticante: id,
          [Op.and]: [
            literal(`"data"::date BETWEEN '${primeiroDiaFormatado}' AND '${ultimoDiaFormatado}'`)
          ],
          presenca: "Presente",
        },
      });

      const totalSessoes = frequencias.length;

      console.log(
        `Frequência do mês passado para o praticante ${id}: ${totalSessoes} sessões`
      );

      return res.status(200).json({ totalSessoes });
    } catch (err) {
      console.error("Erro ao calcular frequência do mês passado:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    let {
      praticante_nome,
      profissional_nome,
      turno,
      sessoes,
      data,
      presenca,
      justificativa,
      id_fisioterapeuta,
      horario,
      digital, // Digital recebida no request
    } = req.body;
    digital = digital ? "sim" : "nao"; // Verifica se o digital é 'sim' ou 'nao'
    try {
      const foundFrequencia = await Frequencia.findByPk(id);
      if (!foundFrequencia) {
        return res.status(404).json({ error: "Frequência não encontrada" });
      }

      await foundFrequencia.update({
        praticante_nome,
        profissional_nome,
        turno,
        sessoes,
        data,
        presenca,
        justificativa,
        id_fisioterapeuta,
        horario,
        digital, // Atualiza o digital
      });

      return res.status(200).json(foundFrequencia);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao atualizar frequência" });
    }
  }

  async relatorio(req: Request, res: Response) {
    const { id_praticante, data_inicio, data_fim } = req.query;

    if (!id_praticante) {
      return res.status(400).json({ error: "ID do praticante é obrigatório" });
    }

    try {
      let where: any = { id_praticante };

      if (data_inicio && data_fim) {
        where.data = {
          [Op.between]: [data_inicio, data_fim],
        };
      }

      const frequencias = await Frequencia.findAll({
        where,
        order: [
          ["data", "ASC"],
          ["horario", "ASC"],
        ],
      });

      return res.status(200).json(frequencias);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const foundFrequencia = await Frequencia.findByPk(id);
      if (!foundFrequencia) {
        return res.status(404).json({ error: "Frequência não encontrada" });
      }
      await foundFrequencia.destroy();
      return res
        .status(204)
        .json({ message: "Frequência deletada com sucesso" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new FrequenciaController();
