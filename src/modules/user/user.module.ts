import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[],
  controllers: [UserController],
  providers: [UserService,PrismaService, JwtService],
})
export class UserModule {}
