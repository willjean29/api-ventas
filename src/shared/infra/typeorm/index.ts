import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'ApiVentasDB',
  port: 5432,
  username: 'postgres',
  password: 'clipar567',
  database: 'ApiVentasDB',
  entities: ['./src/modules/**/typeorm/entities/*.ts'],
  migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('db connected');
    AppDataSource.runMigrations();
  })
  .catch(err => {
    console.log({ err });
    console.log('DB error');
  });
