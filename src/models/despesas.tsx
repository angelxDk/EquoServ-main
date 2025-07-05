import { Model, DataTypes, Sequelize, ModelCtor } from 'sequelize';

class Despesas extends Model {
  public id!: number;
  public mes_referencia_id!: number;
  public colaborador_id?: number;
  public valor!: number;
  public descricao?: string;
  public observacoes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Despesas.init(
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
        colaborador_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        valor: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
        },
        descricao: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        observacoes: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Despesas',
        tableName: 'despesas',
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
    this.belongsTo(models.Colaboradores, {
      foreignKey: 'colaborador_id',
      as: 'colaborador',
      onDelete: 'SET NULL',
    });
  }
}

export default Despesas;
