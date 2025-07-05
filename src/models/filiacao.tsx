import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { sequelize } from '../database';

interface FiliacaoAttributes {
  id: number;
  nome_responsavel: string;
  digital: string;
  telefone_responsavel: string;
  praticante_id: number;
  parentesco: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface FiliacaoCreationAttributes extends Optional<FiliacaoAttributes, 'id'> {}

class Filiacao extends Model<FiliacaoAttributes, FiliacaoCreationAttributes> implements FiliacaoAttributes {
  declare id: number;
  declare nome_responsavel: string;
  declare digital: string;
  declare telefone_responsavel: string;
  declare praticante_id: number;
  declare parentesco: string;
  declare endereco: string;
  declare numero: string;
  declare bairro: string;
  declare cidade: string;
  declare estado: string;
  declare cep: string;

  // Não declare createdAt e updatedAt como campos de classe

  static initModel(sequelize: Sequelize) {
    Filiacao.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nome_responsavel: {
          type: new DataTypes.STRING,
          allowNull: false,
        },
        digital: {
          type: DataTypes.TEXT('long'), // Use DataTypes.TEXT para strings longas
          allowNull: true,
        },
        telefone_responsavel: {
          type: new DataTypes.STRING,
          allowNull: false,
        },
        praticante_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        parentesco: {
          type: new DataTypes.STRING,
          allowNull: false,
        },
        endereco: {
          type: new DataTypes.STRING,
          allowNull: false,
        },
        numero: {
          type: new DataTypes.STRING,
          allowNull: false,
        },
        bairro: {
          type: new DataTypes.STRING,
          allowNull: false,
        },
        cidade: {
          type: new DataTypes.STRING,
          allowNull: false,
        },
        estado: {
          type: new DataTypes.STRING,
          allowNull: false,
        },
        cep: {
          type: new DataTypes.STRING,
          allowNull: false,
        },
        // Remova createdAt e updatedAt daqui
      },
      {
        sequelize,
        modelName: 'Filiacao',
        tableName: 'filiacao',
        schema: 'equodb',
        timestamps: true, // Certifique-se de que os timestamps estão ativados
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.Praticante, {
      foreignKey: 'praticante_id',
      as: 'praticante',
      onDelete: 'SET NULL',
    });
  }
}

export default Filiacao;