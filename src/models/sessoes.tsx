import { Model, DataTypes, Sequelize } from 'sequelize';
import Praticante from './praticante';
import Funcionario from './funcionario';

class Sessao extends Model {
  public id!: number;
  public praticante!: string;
  public profissional!: string;
  public horario_sessao!: TimeRanges;
  public hora_fim!: TimeRanges;
  public dia_semana!: string; 
  public turno!: string;
  public tempo_duracao!: string | null;
  public obs!: string | null;
  public id_praticante!: number;
  public id_profissional!: number;
  public numero_sessoes!: number; 
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Sessao.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        praticante: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        profissional: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        horario_sessao: {
          type: DataTypes.TIME,
          allowNull: false,
        },
        hora_fim: {
          type: DataTypes.TIME,
          allowNull: false,
        },
        dia_semana: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        turno: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        tempo_duracao: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        obs: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        id_praticante: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'praticantes', key: 'id' },
        },
        id_profissional: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'profissionais', key: 'id' },
        },
        numero_sessoes: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: 'Sessao',
        tableName: 'sessoes',
        schema: 'equodb',
        timestamps: true,
        underscored: true,
      }
    );
  }

  public static associate(models: { [key: string]: typeof Model }) {
    Sessao.belongsTo(Praticante, {
      foreignKey: 'id_praticante',
      as: 'praticanteData',
    });
    Sessao.belongsTo(Funcionario, {
      foreignKey: 'id_profissional',
      as: 'profissionalData',
    });
  }
}

export default Sessao;
