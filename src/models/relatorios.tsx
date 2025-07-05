import { Model, DataTypes, Sequelize, ModelCtor } from 'sequelize';

class Relatorios extends Model {
  public id!: number;
  public descricao!: string;
  public nome_praticante!: string;
  public freq_mensal!: string;
  public desc_atvd!: string;
  public obs!: string;
  public profissional!: string;
  public tamanho!: number;
  public funcionario_id!: number;
  public praticante_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Relatorios.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        descricao: {
          type: new DataTypes.STRING,
          allowNull: true,
        },
        nome_praticante: {
          type: new DataTypes.STRING,
          allowNull: true,
        },
        freq_mensal: {
          type: new DataTypes.STRING,
          allowNull: true,
        },
        desc_atvd: {
          type: new DataTypes.STRING,
          allowNull: true,
        },
        obs: {
          type: new DataTypes.STRING,
          allowNull: true,
        },
        profissional: {
          type: new DataTypes.STRING,
          allowNull: true,
        },
        tamanho: {
          type: new DataTypes.FLOAT,
          allowNull: true,
        },
        funcionario_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        praticante_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Relatorios',
        tableName: 'relatorios',
        schema: 'equodb',
      }
    );
  }

  static associate(models: { [key: string]: ModelCtor<Model> }) {
    this.belongsTo(models.Funcionario, {
      foreignKey: 'funcionarioId',
      as: 'funcionario',
      onDelete: 'SET NULL',
    });
    this.belongsTo(models.Praticante, {
      foreignKey: 'praticanteId',
      as: 'praticante',
      onDelete: 'SET NULL',
    });
  }
}

export default Relatorios;
