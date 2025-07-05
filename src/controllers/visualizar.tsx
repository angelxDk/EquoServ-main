import { Request, Response } from "express";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3Config";

export const viewReport = async (req: Request, res: Response) => {
  const { filename } = req.params;
  const bucketName = "relatoriosequopasso";

  try {
    const command = new GetObjectCommand({
      Bucket: "relatoriosequopasso",
      Key: filename,
    });

    const s3Response = await s3.send(command);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

    (s3Response.Body as NodeJS.ReadableStream).pipe(res);
  } catch (error) {
    console.error("Erro ao visualizar relatório:", error);
    res.status(500).json({ message: "Erro ao visualizar relatório" });
  }
};
