import { Model, DataTypes, Sequelize } from 'sequelize';

class Colaboradores extends Model {
  public id!: number;
  public nome!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Colaboradores.init(
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
      },
      {
        sequelize,
        modelName: 'Colaboradores',
        tableName: 'colaboradores',
        schema: 'equodb',
      }
    );
  }
}

export default Colaboradores;
