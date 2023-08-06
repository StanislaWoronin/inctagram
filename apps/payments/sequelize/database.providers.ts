import { Sequelize } from 'sequelize';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'nest',
      });
      sequelize.models([]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
