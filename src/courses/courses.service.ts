import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Course } from './entities/courses.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tags.entity';
import { CreateCourseDto } from './dto/create-course-dto';
import { updateCourseDTO } from './dto/update-course-dto';

@Injectable()
export class CoursesService {
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>;
    
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>;

    async findAll() {
        return this.courseRepository.find({
            relations: { tags: true },
            //  relations: ['tags'] tambem funcionaria tem o mesmo proposito
        });
    }

    async findOne(id: string) {
        const course = await this.courseRepository.findOne({
            where: { id },
            relations: { tags: true },
        });
        if (!course) {
            throw new HttpException(
                `Course ID:${id} not found`,
                HttpStatus.NOT_FOUND,
            );
        }
        return course;
    }

    async create(createCourseDTO: CreateCourseDto) {
        const tags = await Promise.all(
            createCourseDTO.tags.map((name) => this.preloadTagByName(name)),
        );
        const course = this.courseRepository.create({
            ...createCourseDTO,
            tags,
        });

        return this.courseRepository.save(course);
    }

    async update(id: string, updateCourseDTO: updateCourseDTO) {
        const tags =
            updateCourseDTO.tags &&
            (await Promise.all(
                updateCourseDTO.tags.map((name) => this.preloadTagByName(name)),
            ));
        const course = await this.courseRepository.preload({
            ...updateCourseDTO,
            id,
            tags,
        });

        if (!course) {
            throw new HttpException(
                `Course ID:${id} not found`,
                HttpStatus.NOT_FOUND,
            );
        }

        return this.courseRepository.save(course);
    }

    async remove(id: string) {
        const course = await this.courseRepository.findOne({
            where: { id },
        });
        if (!course) {
            throw new HttpException(
                `Course ID:${id} not found`,
                HttpStatus.NOT_FOUND,
            );
        }

        return this.courseRepository.remove(course);
    }

    private async preloadTagByName(name: string): Promise<Tag> {
        const tag = await this.tagRepository.findOne({
            where: { name },
        });
        if (tag) {
            return tag;
        }

        return this.tagRepository.create({ name });
    }
}
