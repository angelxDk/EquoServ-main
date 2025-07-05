import { Model, DataTypes, Sequelize } from 'sequelize';

class Usuario extends Model {
  declare id: number;
  declare nome: string;
  declare senha: string;
  declare perfil: string;
  declare email: string;
  declare telefone: string;
  declare image: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public static initModel(sequelize: Sequelize): void {
    Usuario.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nome: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        senha: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        perfil: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        telefone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Usuario',
        tableName: 'usuario',
        schema: 'equodb',
        timestamps: true, 
      }
    );
  }

  public static associate(models: { [key: string]: typeof Model }) {
  }
}

export default Usuario;
