import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'clipar567',
  database: 'api_ventas',
  entities: ['./src/modules/**/typeorm/entities/*.ts'],
  migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('db connected');
  })
  .catch(() => {
    console.log('DB error');
  });
