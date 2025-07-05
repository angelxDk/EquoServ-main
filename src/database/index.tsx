import Banco from '../config/database';
import Filiacao from '../models/filiacao';
import Frequencia from '../models/frequencia';
import Funcionario from '../models/funcionario';
import Praticante from '../models/praticante';
import Relatorios from '../models/relatorios';
import Sessao from '../models/sessoes';
import Usuario from '../models/usuario';
import Despesas from '../models/despesas';
import Receitas from '../models/receitas';
import Colaboradores from '../models/colaboradores';
import MesReferencia from '../models/mesreferencia';


const models = {
    Usuario,
    Praticante,
    Funcionario,
    Filiacao,
    Relatorios,
    Frequencia,
    Sessao,
    MesReferencia,
    Despesas,
    Receitas,
    Colaboradores,
};

class Database {
    public connection: any;

    constructor() {
        this.init();
    }

    init() {
      this.connection = Banco;

      Object.values(models).forEach((model: any) => {
          model.initModel(this.connection);
      });

      Object.values(models).forEach((model: any) => {
          if (typeof model.associate === 'function') {
              model.associate(this.connection.models);
          }
      });
  }
}

// Export a singleton instance of Database
const databaseInstance = new Database();

export default databaseInstance;
export const sequelize = Banco;
