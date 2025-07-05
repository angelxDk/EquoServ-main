import { Model, DataTypes, Sequelize } from 'sequelize';

class MesReferencia extends Model {
  public id!: number;
  public mes!: number;
  public ano!: number;
  public saldo_inicial!: number;
  public saldo_final!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    MesReferencia.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        mes: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        ano: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        saldo_inicial: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
        },
        saldo_final: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: 'MesReferencia',
        tableName: 'mes_referencia',
        schema: 'equodb',
      }
    );
  }
}

export default MesReferencia;
