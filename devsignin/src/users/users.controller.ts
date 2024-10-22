import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/users.model';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signiin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    public async signup(@Body() signupDto: SignupDto): Promise<User> {
        return this.usersService.signUp(signupDto);
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    public async signin(
        @Body() signinDto: SigninDto,
    ): Promise<{ name: string; jwtToken: string; email: string }> {
        return this.usersService.signin(signinDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    public async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}
