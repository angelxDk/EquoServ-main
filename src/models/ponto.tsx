import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Ponto extends Model {
  public id!: number;
  public nome_funcionario!: string;
  public id_funcionario!: number;
  public data_horario!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ponto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nome_funcionario: {
      type: DataTypes.STRING,
    },
    id_funcionario: {
      type: DataTypes.INTEGER,
    },
    data_horario: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "ponto",
    timestamps: true, // Inclui campos createdAt e updatedAt automaticamente
  }
);

export default Ponto;
