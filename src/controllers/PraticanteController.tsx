import Filiacao from '../models/filiacao';
import Praticante from '../models/praticante';
import Funcionario from '../models/funcionario';
import Relatorios from '../models/relatorios';
import { Request, Response } from 'express';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Op } from 'sequelize';

// Configuração do S3
const s3 = new S3Client({
  credentials: {
    accessKeyId: 'AKIA3FLD4V4PREDLCT4J',
    secretAccessKey: '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',
  },
  region: 'us-east-1',
});

class PraticanteController {
  async index(req: Request, res: Response) {
    try {
      const praticantes = await Praticante.findAll();
      res.json(praticantes);
    } catch (err) {
      console.error('Erro ao buscar praticantes:', err);
      res.status(500).json({ error: 'Erro ao buscar praticantes' });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const praticante = await Praticante.findByPk(id);
      if (!praticante) {
        return res.status(404).json({ error: 'Praticante não encontrado' });
      }
      res.json(praticante);
    } catch (err) {
      console.error('Erro ao buscar praticante:', err);
      res.status(500).json({ error: 'Erro ao buscar praticante' });
    }
  }

  async showbyFisioid(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const fisioterapeuta = await Funcionario.findOne({ where: { usuario_id: id } });
      if (!fisioterapeuta) {
        return res.status(404).json({ error: 'Fisioterapeuta não encontrado' });
      }

      const fisioterapeutaId = fisioterapeuta.getDataValue('id');
      const praticantes = await Praticante.findAll({ where: { id_fisioterapeuta: fisioterapeutaId } });

      if (praticantes.length === 0) {
        return res.status(204).json({ message: 'Nenhum praticante encontrado' });
      }
      res.status(200).json(praticantes);
    } catch (err) {
      console.error('Erro ao buscar praticantes pelo ID do fisioterapeuta:', err);
      res.status(500).json({ error: 'Erro ao buscar praticantes pelo ID do fisioterapeuta' });
    }
  }

  async showRelatedProfile(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const praticante = await Praticante.findAll({ where: { usuario_id: id } });

      if (!praticante.length) {
        return res.status(204).json({ message: 'Nenhum praticante relacionado encontrado' });
      }

      return res.status(200).json(praticante);
    } catch (err) {
      console.error('Erro ao buscar praticantes relacionados:', err);
      return res.status(500).json({ error: 'Erro ao buscar praticantes relacionados' });
    }
  }

  async store(req: Request, res: Response) {
    const { nome, idade, sexo, naturalidade, nacionalidade, data_nascimento, nome_escola, periodo, pais_separados, id_fisioterapeuta, sus } = req.body;
    try {
      const newPraticante = await Praticante.create({
        nome,
        idade,
        sexo,
        naturalidade,
        nacionalidade,
        data_nascimento,
        nome_escola,
        periodo,
        pais_separados,
        id_fisioterapeuta,
        sus,
      });

      res.status(201).json(newPraticante);
    } catch (error) {
      console.error('Erro ao criar praticante:', error);
      res.status(500).json({ error: 'Erro ao criar praticante' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    let praticanteData;
    try {
      praticanteData = JSON.parse(req.body.data);
    } catch (error) {
      return res.status(400).json({ error: 'Dados JSON inválidos' });
    }

    try {
      if (req.file && req.file.location) {
        const oldImage = praticanteData.image;
        if (oldImage) {
          const oldImageKey = oldImage.split('.com/')[1];
          try {
            await s3.send(new DeleteObjectCommand({ Bucket: 'imagesequo', Key: oldImageKey }));
          } catch (err) {
            console.error('Erro ao excluir a imagem antiga do S3:', err);
          }
        }
        praticanteData.image = req.file.location;
      }

      const [updatedRows] = await Praticante.update(praticanteData, { where: { id } });

      if (updatedRows === 0) {
        return res.status(404).json({ error: 'Praticante não encontrado ou não houve alterações' });
      }

      const updatedPraticante = await Praticante.findByPk(id);
      res.status(200).json(updatedPraticante);
    } catch (error) {
      console.error('Erro ao atualizar praticante:', error);
      res.status(500).json({ error: 'Erro ao atualizar praticante' });
    }
  }

  async search(req: Request, res: Response) {
    const { searchTerm, perfil, userId } = req.query;

    try {
      let results;

      if (perfil === 'fisioterapeuta') {
        const fisioterapeuta = await Funcionario.findOne({ where: { usuario_id: userId } });
        if (!fisioterapeuta) {
          return res.status(404).json({ error: 'Fisioterapeuta não encontrado' });
        }

        const fisioterapeutaId = fisioterapeuta.getDataValue('id');
        results = await Praticante.findAll({
          where: {
            id_fisioterapeuta: fisioterapeutaId,
            nome: { [Op.iLike]: `%${searchTerm}%` },
          },
        });
      } else {
        results = await Praticante.findAll({
          where: { nome: { [Op.iLike]: `%${searchTerm}%` } },
        });
      }

      res.status(200).json(results);
    } catch (error) {
      console.error('Erro ao buscar praticantes:', error);
      res.status(500).json({ error: 'Erro ao buscar praticantes' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const praticante = await Praticante.findByPk(id);

      if (!praticante) {
        return res.status(404).json({ error: 'Praticante não encontrado' });
      }

      const imageUrl = praticante.getDataValue('image');
      if (imageUrl) {
        const imageKey = imageUrl.split('.com/')[1];
        try {
          await s3.send(new DeleteObjectCommand({ Bucket: 'imagesequo', Key: imageKey }));
        } catch (err) {
          console.error('Erro ao excluir a imagem do S3:', err);
        }
      }

      await Filiacao.destroy({ where: { praticante_id: id } });
      await Relatorios.destroy({ where: { praticante_id: id } });
      await Praticante.destroy({ where: { id } });

      res.status(200).json({ message: 'Praticante excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir praticante:', error);
      res.status(500).json({ error: 'Erro ao excluir praticante' });
    }
  }
}

export default new PraticanteController();
