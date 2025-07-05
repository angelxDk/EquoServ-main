import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3Config";

export const downloadReport = async (req, res) => {
  const { filename } = req.params;

  try {
    const command = new GetObjectCommand({
      Bucket: "relatoriosequopasso",
      Key: filename,
    });

    const s3Response = await s3.send(command);

    // Define cabeçalhos para forçar download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Faz stream direto do S3 para a resposta
    (s3Response.Body as NodeJS.ReadableStream).pipe(res);
  } catch (error) {
    console.error("Erro ao baixar arquivo do S3:", error);
    res.status(500).json({ message: "Erro ao baixar relatório" });
  }
};
