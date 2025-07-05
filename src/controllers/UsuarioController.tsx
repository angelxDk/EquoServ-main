import { Request, Response } from "express";
import Usuario from "../models/usuario";
import Funcionario from "../models/funcionario";
import CryptoJS from "crypto-js";
import { Op } from "sequelize";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const secretKey = process.env.SECRET_KEY || "your_secret_key";

// Configuração do AWS S3
const s3 = new S3Client({
  credentials: {
    accessKeyId: 'exemple',
    secretAccessKey: secretKey,
  },
  region: 'us-east-1',
});

class UsuarioController {
  // Lista todos os usuários
  async index(req: Request, res: Response) {
    try {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      return res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }

  // Mostra detalhes de um usuário e seu perfil relacionado
  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const perfilRelacionado = await Funcionario.findOne({
        where: { usuario_id: id },
      });

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      return res.json([usuario, perfilRelacionado]);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  }

  // Mostra um usuário específico por ID
  async showUserbyId(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.status(200).json(usuario);
    } catch (err) {
      console.error("Erro ao buscar usuário por ID:", err);
      return res.status(500).json({ error: "Erro ao buscar usuário por ID" });
    }
  }

  // Cria um novo usuário
  async store(req: Request, res: Response) {
    const { nome, senha, perfil, email, idRelacionado, telefone, image } = req.body;

    if (!senha) {
      return res.status(400).json({ message: "Campo de senha é obrigatório" });
    }

    const encryptedPassword = CryptoJS.AES.encrypt(senha, secretKey).toString();

    try {
      if (!idRelacionado) {
        if (!nome || !perfil) {
          return res.status(400).json({ message: "Campos de nome ou perfil estão faltando" });
        }

        const newUsuario = await Usuario.create({
          nome,
          senha: encryptedPassword,
          perfil,
          email,
          telefone,
          image,
        });

        return res.status(201).json(newUsuario);
      } else if (perfil === "fisioterapeuta") {
        const funcionarioRelacionado = await Funcionario.findOne({ where: { id: idRelacionado } });

        if (funcionarioRelacionado?.getDataValue("usuario_id")) {
          return res.status(400).json({ message: "Perfil já está relacionado a um usuário" });
        }

        const newUsuario = await Usuario.create({
          nome,
          senha: encryptedPassword,
          perfil,
          email,
          telefone,
          image,
        });

        if (funcionarioRelacionado) {
          await funcionarioRelacionado.update({ usuario_id: newUsuario.getDataValue("id") });
        }

        return res.status(201).json(newUsuario);
      }
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      return res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }

  // Atualiza um usuário existente
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, senha, perfil, email, telefone } = req.body;

    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const updates: any = {};
      if (nome) updates["nome"] = nome;
      if (perfil) updates["perfil"] = perfil;
      if (email) updates["email"] = email;
      if (telefone) updates["telefone"] = telefone;

      if (req.file && req.file.location) {
        const oldImage = usuario.getDataValue("image");
        if (oldImage) {
          const oldImageKey = oldImage.split(".com/")[1];
          try {
            await s3.send(new DeleteObjectCommand({ Bucket: "imagesequo", Key: oldImageKey }));
          } catch (err) {
            console.error("Erro ao excluir a imagem antiga do S3:", err);
          }
        }
        updates["image"] = req.file.location;
      }

      if (senha) {
        updates["senha"] = CryptoJS.AES.encrypt(senha, secretKey).toString();
      }

      await usuario.update(updates);
      const updatedUser = await Usuario.findByPk(id);

      return res.status(200).json(updatedUser);
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  }

  // Busca usuários com base no termo de pesquisa
  async search(req: Request, res: Response) {
    const { searchTerm } = req.query;

    try {
      const results = await Usuario.findAll({
        where: {
          nome: { [Op.iLike]: `%${searchTerm}%` },
        },
      });
      res.status(200).json(results);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }

  // Exclui um usuário e remove sua imagem do S3
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const funcionarioRelacionado = await Funcionario.findOne({ where: { usuario_id: id } });
      if (funcionarioRelacionado) {
        await funcionarioRelacionado.update({ usuario_id: null });
      }

      const imageUrl = usuario.getDataValue("image");
      if (imageUrl) {
        const imageKey = imageUrl.split(".com/")[1];
        try {
          await s3.send(new DeleteObjectCommand({ Bucket: "imagesequo", Key: imageKey }));
        } catch (err) {
          console.error("Erro ao excluir imagem do S3:", err);
        }
      }

      await usuario.destroy();
      return res.status(204).json({ message: "Usuário deletado com sucesso" });
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      return res.status(500).json({ error: "Erro ao excluir usuário" });
    }
  }
}

export default new UsuarioController();
