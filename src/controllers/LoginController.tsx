import { Request, Response } from 'express';
import usuario from '../models/usuario';
import CryptoJS from 'crypto-js';

const secretKey = process.env.SECRET_KEY || 'your_secret_key';

class LoginController {
    async store(req: Request, res: Response) {
        const { nome, senha } = req.body;
        try {
            const userFound = await usuario.findOne({ where: { nome: nome } });
            if (!userFound) {
                return res.status(401).json({ error: 'Usuário ou senha incorretos' });
            }

            const storedEncryptedPassword = userFound.getDataValue('senha');
            const decryptedPasswordBytes = CryptoJS.AES.decrypt(storedEncryptedPassword, secretKey);
            const decryptedPassword = decryptedPasswordBytes.toString(CryptoJS.enc.Utf8);

            if (senha !== decryptedPassword) {
                return res.status(401).json({ error: 'Usuário ou senha incorretos' });
            }

            const id = userFound.getDataValue('id');
            const perfil = userFound.getDataValue('perfil');
            return res.status(200).json({
                data: { id, nome, senha, perfil },
            });
        } catch (error) {
            console.error('Error while finding user:', error);
            return res.status(500).json({ error: 'Erro interno ao fazer login' });
        }
    }
}

export default new LoginController();
