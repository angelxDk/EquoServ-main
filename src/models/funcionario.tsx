import { Model, DataTypes, Sequelize } from 'sequelize';

class Funcionario extends Model {
  public id!: number;
  public nome!: string;
  public cpf!: string;
  public email!: string;
  public dataNascimento!: Date;
  public usuario_id!: number;
  public telefone!: string;
  public endereco!: string;
  public image!: string;
  public tipo!: string;
  public digital!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Funcionario.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cpf: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      endereco: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dataNascimento: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      digital: {
        type: DataTypes.TEXT('long'), // Use DataTypes.TEXT para strings longas
        allowNull: true,
      },
    }, {
      sequelize,
      modelName: 'Funcionario',
      tableName: 'funcionario',
      schema: 'equodb',
    });
  }

  static associate(models: any) {
    this.belongsTo(models.Usuario, {
      foreignKey: 'usuario_id',
      as: 'usuario',
      onDelete: 'SET NULL',
    });
  }
}

export default Funcionario;