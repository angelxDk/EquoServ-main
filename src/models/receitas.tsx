import { Model, DataTypes, Sequelize, ModelCtor } from 'sequelize';

class Receitas extends Model {
  public id!: number;
  public mes_referencia_id!: number;
  public descricao!: string;
  public valor!: number;
  public observacoes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Receitas.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        mes_referencia_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        descricao: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        valor: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
        },
        observacoes: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Receitas',
        tableName: 'receitas',
        schema: 'equodb',
      }
    );
  }

  static associate(models: { [key: string]: ModelCtor<Model> }) {
    this.belongsTo(models.MesReferencia, {
      foreignKey: 'mes_referencia_id',
      as: 'mesReferencia',
      onDelete: 'CASCADE',
    });
  }
}

export default Receitas;
