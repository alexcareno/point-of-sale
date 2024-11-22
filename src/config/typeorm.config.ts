import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const typeOrmConfig = (ConfigService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: ConfigService.get('DATABASE_HOST'),
    port: ConfigService.get('DATABASE_PORT'),
    username: ConfigService.get('DATABASE_USER'),
    password: ConfigService.get('DATABASE_PASS'),
    database: ConfigService.get('DATABASE_NAME'),
    ssl: true,
    logging: true,
    entities: [join(__dirname + '../../**/*.entity.{ts,js}')],
    synchronize: true, // set to false in production
});