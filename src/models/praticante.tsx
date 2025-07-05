import { Model, DataTypes, Sequelize, ModelCtor } from 'sequelize';

class Praticante extends Model {
  public id!: number;
  public nome!: string;
  public sus!: string;
  public data_nascimento!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
  public idade!: number;
  public naturalidade!: string;
  public nacionalidade!: string;
  public sexo!: string;
  public image!: string;
  public nome_escola!: string;
  public periodo!: string;
  public pais_separados!: string;
  public id_fisioterapeuta!: number;
  public id_fono!: number;
  static image: any;

  static initModel(sequelize: Sequelize) {
    Praticante.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        sus: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        data_nascimento: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'data_nascimento',
        },
        createdAt: {
          type: DataTypes.DATE,
          field: 'created_at',
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: 'updated_at',
          defaultValue: DataTypes.NOW,
        },
        idade: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        naturalidade: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        nacionalidade: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        sexo: {
          type: DataTypes.ENUM,
          values: ['masculino', 'feminino', 'outro']
        },
        nome_escola: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        periodo: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        pais_separados: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        id_fisioterapeuta: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        id_fono: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Praticante',
        tableName: 'praticante',
        schema: 'equodb',
      }
    );
  }

  static associate(models: { [key: string]: ModelCtor<Model> }) {
  }
}

export default Praticante;
