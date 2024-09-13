import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database.module';
import { CreateCoursesTable1725999732208 } from 'src/migrations/1725999732208-CreateCoursesTable';
import { CreateTagsTable1726052658345 } from 'src/migrations/1726052658345-CreateTagsTable';
import { CreateCoursesTagsTable1726055018061 } from 'src/migrations/1726055018061-CreateCoursesTagsTable';
import { AddCoursesIdToCoursesTagsTable1726055532987 } from 'src/migrations/1726055532987-AddCoursesIdToCoursesTagsTable';
import { AddTagsIdToCoursesTagsTable1726056505570 } from 'src/migrations/1726056505570-AddTagsIdToCoursesTagsTable';

export const dataSource = new DataSource({
    ...dataSourceOptions,
    synchronize: false,
    migrations: [
        CreateCoursesTable1725999732208,
        CreateTagsTable1726052658345,
        CreateCoursesTagsTable1726055018061,
        AddCoursesIdToCoursesTagsTable1726055532987,
        AddTagsIdToCoursesTagsTable1726056505570,
    ],
});
