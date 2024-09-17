import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Put,
} from '@nestjs/common';
import { response } from 'express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course-dto';
import { updateCourseDTO } from './dto/update-course-dto';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @Get()
    findAll() {
        return this.coursesService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coursesService.findOne(id)
    }

    @Post()
    create(@Body() createCourseDto: CreateCourseDto) {
        return this.coursesService.create(createCourseDto)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCourseDTO: updateCourseDTO) {
        return this.coursesService.update(id, updateCourseDTO)
    }


    @HttpCode(204)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coursesService.remove(id)
    }
}
