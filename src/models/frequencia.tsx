import { Model, DataTypes, Sequelize, ModelCtor } from 'sequelize';
import { AssociableModel } from '../types/models'; // Certifique-se de ajustar o caminho conforme necessário
import Fisioterapeuta from './funcionario';

class Frequencia extends Model implements AssociableModel {
  public id!: number;
  public praticante_nome!: string;
  public profissional_nome!: string;
  public turno!: string;
  public numero_sessao!: number;
  public data!: Date;
  public presenca!: boolean;
  public justificativa!: string;
  public id_fisioterapeuta!: number;
  public id_praticante!: number;
  public horario!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Frequencia.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      praticante_nome: {
        type: DataTypes.STRING,
        allowNull: true
      },
      profissional_nome: {
        type: DataTypes.STRING,
        allowNull: true
      },
      turno: {
        type: DataTypes.STRING,
        allowNull: true
      },
      numero_sessao: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      data: {
        type: DataTypes.DATE,
        allowNull: true
      },
      presenca: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      justificativa: {
        type: DataTypes.STRING,
        allowNull: true
      },
      id_praticante: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Praticantes', // Ensure this matches your Usuario model's table name
          key: 'id'
        }
      },
        id_fisioterapeuta: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Fisioterapeutas', // Ensure this matches your Fisioterapeuta model's table name
            key: 'id'
          }
        },
        horario: {
          type: DataTypes.DATE,
          allowNull: true
        },
        digital: {
          type: DataTypes.STRING,
          allowNull: true
        }
      }, {
      sequelize,
      modelName: 'Frequencia',
      tableName: 'frequencia',
      schema: 'equodb',
      timestamps: true, // This will automatically add `createdAt` and `updatedAt` fields
    });
  }

  public static associate(models: { [key: string]: typeof Model }) {

    this.belongsTo(Fisioterapeuta, {
      foreignKey: 'id_fisioterapeuta',
      as: 'fisioterapeuta',
      onDelete: 'CASCADE',
    });
    // Add other associations here if needed
  }
}

export default Frequencia;
