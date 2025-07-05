import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

// Configuração do AWS S3 com SDK V3
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: 'us-east-1',
});

// Configuração do Multer com Multer-S3
const uploadImage = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME || "example-bucket", // Substitua pelo nome do seu bucket
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueFileName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueFileName);
    },
  }),
});

export default uploadImage;
