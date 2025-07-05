import { Sequelize } from 'sequelize';

const Banco = new Sequelize('polls', 'postgres', 'docker', {

  host: '127.0.0.1',
  dialect: 'postgres',
  define: {
    timestamps: true,
    underscored: true,
  },
  schema: 'equodb',
});


export default Banco;
