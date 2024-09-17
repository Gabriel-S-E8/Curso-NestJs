import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/models/users.model';
import { sign } from 'jsonwebtoken';
import { Request } from 'express';
import { jwtPayLoad } from './models/jwt-payload.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User')
        private readonly usersModel: Model<User>,
    ) {}

    public async createAcessToken(userId: string): Promise<string> {
        return sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
        });
    }

    public async validateUser(jwtPayload: jwtPayLoad): Promise<User> {
        const user = await this.usersModel.findOne({ _id: jwtPayload.userId });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }

    private jwtExtractor(req: Request): string {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new BadRequestException('Bad request');
        }

        const [, token] = authHeader.split(' ');
        return token;
    }

    public returnJwtExtractor(): (req: Request) => string {
        return this.jwtExtractor;
    }
}
