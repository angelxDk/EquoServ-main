import path from "path";
import PDFDocument from "pdfkit";
import { Request, Response } from "express";
import fs from "fs";
import moment from "moment";
import sharp from "sharp";
import Praticante from "../models/praticante";
import Funcionario from "../models/funcionario";
import Relatorios from "../models/relatorios";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Op } from "sequelize";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3Config";

const bucketName = process.env.S3_BUCKET_NAME || "relatoriosequopasso";

class RelatoriosController {
  async index(req: Request, res: Response) {
    try {
      const relatorios = await Relatorios.findAll();
      return res.json(relatorios);
    } catch (error) {
      console.error("Error fetching reports:", error);
      return res.status(500).json({ error: "Error fetching reports" });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const relatorio = await Relatorios.findAll({
        where: { funcionario_id: id },
      });
      return res.json(relatorio);
    } catch (error) {
      console.error("Error fetching report:", error);
      return res.status(500).json({ error: "Error fetching report" });
    }
  }

  async showById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const funcionario = await Funcionario.findOne({
        where: { usuario_id: id },
      });

      if (!funcionario) {
        return res.status(404).json({ error: "Funcionario not found" });
      }

      const funcionarioId = funcionario.getDataValue("id");
      const relatorio = await Relatorios.findAll({
        where: { funcionario_id: funcionarioId },
      });

      return res.status(200).json(relatorio);
    } catch (error) {
      console.error("Error fetching report by ID:", error);
      return res.status(500).json({ error: "Error fetching report by ID" });
    }
  }

  async showByIdReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const relatorio = await Relatorios.findByPk(id);

      if (!relatorio) {
        return res.status(404).json({ error: "Report not found" });
      }

      return res.status(200).json(relatorio);
    } catch (error) {
      console.error("Error fetching report by ID:", error);
      return res.status(500).json({ error: "Error fetching report by ID" });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const data = req.body;
      console.log("Dados recebidos:", data);
      // Buscar praticante e funcionário
      const praticante = await Praticante.findByPk(data.praticanteId);
      const funcionario = await Funcionario.findByPk(data.funcionarioId);

      if (!praticante)
        return res.status(404).json({ error: "Praticante not found" });
      if (!funcionario)
        return res.status(404).json({ error: "Funcionario not found" });

      // Obter imagem do praticante ou default
      const imageUrl = praticante.getDataValue("image");
      const imageKey = imageUrl
        ? decodeURIComponent(imageUrl).split(".com/")[1]
        : "default-avatar.png";

      let s3Image;
      try {
        const s3Response = await s3.send(
          new GetObjectCommand({ Bucket: "imagesequo", Key: imageKey })
        );
        s3Image = s3Response.Body;
      } catch {
        s3Image = fs.readFileSync(
          path.resolve(__dirname, "..", "..", "assets", "default-avatar.jpeg")
        );
      }

      // Criar imagem arredondada do avatar com sharp
      const roundedImageBuffer = await sharp(s3Image)
        .resize(100, 100)
        .composite([
          {
            input: Buffer.from('<svg><circle cx="50" cy="50" r="50"/></svg>'),
            blend: "dest-in",
          },
        ])
        .png()
        .toBuffer();

      // Preparar nome do arquivo
      const now = moment();
      const dataCriacao = now.format("DD-MM-YYYY_HH-mm-ss");
      const fileName = `Relatorio_${data.nomeDoPraticante.replace(
        /\s/g,
        "_"
      )}-${dataCriacao}.pdf`;

      // Criar PDF em memória
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", async () => {
        const pdfBuffer = Buffer.concat(buffers);

        // Upload para S3
        await s3.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: pdfBuffer,
            ContentType: "application/pdf",
            ACL: "public-read",
          })
        );

        // Salvar no banco
        const relatorio = await Relatorios.create({
          descricao: fileName,
          funcionarioId: data.funcionarioId,
          praticanteId: data.praticanteId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return res.status(200).json({
          message: "Relatório gerado e enviado com sucesso",
          report: relatorio,
          url: `https://${bucketName}.s3.amazonaws.com/${fileName}`,
        });
      });
      const logoImgPath = path.resolve(
        __dirname,
        "..",
        "..",
        "assets",
        "equo.png"
      ); // logo convertida para PNG
      // Inserir logo no canto superior esquerdo
      if (fs.existsSync(logoImgPath)) {
        doc.image(logoImgPath, 50, 40, { width: 90 });
      }
      // Cabeçalho texto
      doc
        .fontSize(18)
        .text("EquoPasso", 160, 50, { align: "left" })
        .fontSize(10)
        .text("Parque de Exposição do Sindicato Rural de Jardim/MS", 160, 75)
        .text("117,44 km zona rural, Jardim - MS, 79240-000");

      // Avatar do praticante no canto superior direito
      doc.image(roundedImageBuffer, 470, 40, { width: 70, height: 70 });

      // Espaçamento antes do título
      doc.moveDown(3);

      // Título principal com linha de base
      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .fillColor("#000")
        .text("RELATÓRIO DE SESSÃO DE EQUOTERAPIA", 50, 130, {
          align: "center",
        });

      doc
        .moveTo(50, 150)
        .lineTo(545, 150)
        .strokeColor("#444")
        .lineWidth(1)
        .stroke();

      doc.moveDown(2);

      // Bloco: Dados do Praticante
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#000")
        .text("Dados do Praticante", { underline: true });

      doc.moveDown(0.5);
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#000")
        .text(`• Nome: ${data.nomeDoPraticante}`)
        .text(`• Fisioterapeuta Responsável: ${data.profissional}`)
        .text(`• Frequência Mensal: ${data.frequenciaMensal || "N/A"}`)
        .text(`• Número da Sessão: ${data.numeroSessao || "N/A"}`)
        .text(`• Data da Sessão: ${moment(data.dataReferencia).format("DD/MM/YYYY")}`);

      doc.moveDown(1.5);

      // Bloco: Equipe Técnica
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Equipe Técnica Envolvida", { underline: true });

      doc.moveDown(0.5);
      doc
        .font("Helvetica")
        .fontSize(11)
        .text(`• Guia: ${data.guia || "N/A"}`)
        .text(`• Mediadora: ${data.mediadora || "N/A"}`)
        .text(`• Lateral: ${data.lateral || "N/A"}`)
        .text(`• Cavalo: ${data.cavalo || "N/A"}`)
        .text(`• Arreamento: ${data.arreamento || "N/A"}`);

      doc.moveDown(1.5);

      // Bloco: Atividades Realizadas
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Descrição das Atividades", { underline: true });

      doc.moveDown(0.5);
      doc
        .font("Helvetica")
        .fontSize(11)
        .text(data.descricaoAtividades || "Sem descrição informada", {
          align: "justify",
          lineGap: 4,
        });

      doc.moveDown(2);

      // Linha separadora antes do rodapé
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor("#aaa")
        .lineWidth(0.5)
        .stroke();

      doc.moveDown(1);

      // Rodapé com timestamp
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("gray")
        .text(
          `Relatório gerado em: ${now.format(
            "DD/MM/YYYY HH:mm:ss"
          )}`,

          {
            align: "right",
          }
        );

      doc.end();
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async visualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const relatorio = await Relatorios.findByPk(id);
      console.log("Relatório encontrado:", relatorio);
      console.log("ID do relatório:", id);

      if (!relatorio) {
        return res.status(404).json({ error: "Relatório não encontrado" });
      }
      const fileName = relatorio.getDataValue("descricao");
      console.log("File name:", fileName);
      const filePath = path.resolve(
        __dirname,
        "..",
        "..",
        "reports",
        `${fileName}.pdf`
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "inline; filename=" + `${fileName}.pdf`
      );
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Erro ao visualizar relatório:", error);
      return res.status(500).json({ error: "Erro ao visualizar relatório" });
    }
  }

  async download(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const relatorio = await Relatorios.findByPk(id);
      console.log("Relatório encontrado:", relatorio);
      console.log("ID do relatório:", id);
      console.log(
        "Caminho do relatório:",
        path.resolve(
          __dirname,
          "..",
          "..",
          "reports",
          `${relatorio?.getDataValue("descricao")}.pdf`
        )
      );

      if (!relatorio) {
        return res.status(404).json({ error: "Report not found" });
      }

      const reportPath = path.resolve(
        __dirname,
        "..",
        "..",
        "reports",
        `${relatorio.getDataValue("descricao")}.pdf`
      );

      if (!fs.existsSync(reportPath)) {
        return res.status(404).json({ error: "File not found" });
      }

      const fileName = relatorio.getDataValue("descricao");
      console.log("File name:", fileName);
      res.download(reportPath, `Relatorio_${id}.pdf`);
    } catch (error) {
      console.error("Error downloading report:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { searchTerm, id } = req.query;
      const fisioterapeuta = await Funcionario.findOne({
        where: { usuario_id: id },
      });

      if (!fisioterapeuta) {
        return res.status(404).json({ error: "Fisioterapeuta not found" });
      }

      const fisioterapeutaId = fisioterapeuta.getDataValue("id");
      const results = await Relatorios.findAll({
        where: {
          funcionario_id: fisioterapeutaId,
          descricao: { [Op.iLike]: `%${searchTerm}%` },
        },
      });

      res.status(200).json(results);
    } catch (error) {
      console.error("Error searching reports:", error);
      res.status(500).json({ error: "Error searching reports" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { descricao, funcionarioId, praticanteId } = req.body;

      const relatorio = await Relatorios.findByPk(id);

      if (!relatorio) {
        return res.status(404).json({ error: "Report not found" });
      }

      await relatorio.update({ descricao, funcionarioId, praticanteId });
      return res.json(relatorio);
    } catch (error) {
      console.error("Error updating report:", error);
      return res.status(500).json({ error: "Error updating report" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const relatorio = await Relatorios.findByPk(id);

      if (!relatorio) {
        return res.status(404).json({ error: "Report not found" });
      }

      const fileName = relatorio.getDataValue("descricao");
      console.log("File name:", fileName);
      console.log("teste->", `Relatorio_${fileName}.pdf`);
      const filePath = path.resolve(
        __dirname,
        "..",
        "..",
        "reports",
        `${fileName}.pdf`
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await relatorio.destroy();
      return res.json({ message: "Report deleted successfully" });
    } catch (error) {
      console.error("Error deleting report:", error);
      return res.status(500).json({ error: "Error deleting report" });
    }
  }
}

export default new RelatoriosController();
