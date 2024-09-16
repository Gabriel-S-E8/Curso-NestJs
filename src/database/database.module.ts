import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/courses.entity';
import { Tag } from 'src/courses/entities/tags.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (configservice: ConfigService) => {
                return {
                    type: 'postgres',
                    host: configservice.get('DB_HOST'),
                    port: Number(configservice.get('DB_PORT')),
                    username: configservice.get('DB_USER'),
                    password: configservice.get('DB_PASS'),
                    database: configservice.get('DB_NAME'),
                    entities: [Course, Tag],
                    synchronize: false,
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [],
})
export class DatabaseModule {}
