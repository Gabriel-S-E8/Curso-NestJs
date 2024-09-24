import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './models/users.model';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signiin.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User')
        private readonly usersModel: Model<User>,
        private readonly authService: AuthService,
    ) {}

    public async signUp(signupDto: SignupDto): Promise<User> {
        const user = new this.usersModel(signupDto);
        return user.save();
    }

    public async signin(
        signinDto: SigninDto,
    ): Promise<{ name: string; jwtToken: string; email: string }> {
        const user = await this.findByEmail(signinDto.email);
        const match = await this.checkPassword(signinDto.password, user);

        if (!match) {
            throw new NotFoundException('Invalid credentials.');
        }

        const jwtToken = await this.authService.createAcessToken(
            user._id as string,
        );

        return { name: user.name, jwtToken, email: user.email };
    }

    public async findAll(): Promise<User[]> {
        return this.usersModel.find();
    }

    private async findByEmail(email: string): Promise<User> {
        const user = await this.usersModel.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    private async checkPassword(
        password: string,
        user: User,
    ): Promise<boolean> {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new NotFoundException('Password not found.');
        }
        return match;
    }
}
