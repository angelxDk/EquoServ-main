import { Request, Response } from 'express';
import Funcionario from '../models/funcionario';
import { Op } from 'sequelize';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client with AWS SDK v3
const s3 = new S3Client({
  credentials: {
    accessKeyId: 'exemple',
    secretAccessKey: 'exemple',
  },
  region: 'us-east-1',
});

class FuncionarioController {
  async index(req: Request, res: Response) {
    try {
      const funcionarios = await Funcionario.findAll();
      return res.json(funcionarios);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async showRelatedProfile(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const funcionario = await Funcionario.findOne({ where: { usuario_id: id } });
      return res.status(200).json(funcionario);
    } catch (err) {
      return res.status(204).json({ error: err.message });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const funcionario = await Funcionario.findByPk(id);
      if (!funcionario) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }
      return res.status(200).json(funcionario);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async store(req, res) {
    try {
      const { nome, cpf, email, dataNascimento, telefone, endereco, usuarioId, tipo, digital } = req.body;

      // Verifica se a digital foi recebida
      if (!digital) {
        return res.status(400).json({ error: 'Digital não informada' });
      }

      // // Converte a digital de Base64 para binário
      // const digitalBuffer = Buffer.from(digital, 'base64');

      // // Criação do template usando o SDK da Digital Persona (exemplo fictício)
      // const dpSdk = new DigitalPersonaSDK();
      // const template = dpSdk.createTemplateFromSample(digitalBuffer);

      // if (!template) {
      //   return res.status(400).json({ error: 'Falha ao criar template biométrico' });
      // }

      // Armazena o template no banco (ajuste conforme sua lógica de banco de dados)
      const funcionario = await Funcionario.create({
        nome,
        cpf,
        email,
        dataNascimento,
        telefone,
        endereco,
        usuarioId,
        tipo,
        digital //template.toBase64(), // Armazena o template no banco
      });

      return res.status(201).json({ message: 'Funcionário criado com sucesso!', funcionario });
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      return res.status(500).json({ error: 'Erro ao criar funcionário' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    let fisioData;
    try {
      fisioData = JSON.parse(req.body.conteudo);
      console.log('Dados recebidos:', fisioData);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    try {
      if (req.file && req.file.location) {
        const oldImage = fisioData.image;
        if (oldImage) {
          const oldImageKey = oldImage.split('.com/')[1];
          const deleteParams = {
            Bucket: 'imagesequo',
            Key: oldImageKey,
          };
          const deleteCommand = new DeleteObjectCommand(deleteParams);
          try {
            await s3.send(deleteCommand);
            console.log('Imagem antiga excluída com sucesso');
          } catch (err) {
            console.error('Erro ao excluir a imagem antiga:', err);
          }
        }
        fisioData.image = req.file.location;
      }
      const [updatedRowCount] = await Funcionario.update(fisioData, { where: { id } });

      if (updatedRowCount === 0) {
        return res.status(404).json({ error: 'Funcionário não encontrado ou não houve alterações' });
      }
      const funcionarioUpdated = await Funcionario.findByPk(id);
      console.log('Funcionário atualizado:', funcionarioUpdated);
      return res.status(200).json(funcionarioUpdated);
    } catch (err) {
      console.error('Erro ao atualizar funcionário:', err);
      return res.status(500).json({ error: 'Erro ao atualizar funcionário' });
    }
  }

  async search(req: Request, res: Response) {
    const { searchTerm } = req.query;
    try {
      const results = await Funcionario.findAll({
        where: { nome: { [Op.iLike]: `%${searchTerm}%` } },
      });
      res.status(200).json(results);
    } catch (error) {
      console.error('Erro ao buscar Funcionário:', error);
      res.status(500).json({ error: 'Erro ao buscar Funcionário' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      console.log('ID recebido:', id);
      const funcionario = await Funcionario.findByPk(id);
      if (!funcionario) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }
      await funcionario.destroy();
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async verifyDigital(req: Request, res: Response) {
    const { id } = req.params;
    const { digital } = req.body;

    try {
      const funcionario = await Funcionario.findByPk(id);
      if (!funcionario) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }

      // Verifica se a digital recebida condiz com a armazenada
      if (funcionario.digital === digital) {
        return res.status(200).json({ message: 'Digital verificada com sucesso' });
      } else {
        return res.status(401).json({ error: 'Digital não corresponde' });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new FuncionarioController();
