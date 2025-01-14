import { BadRequestException, ForbiddenException, Get, Injectable, UnauthorizedException } from '@nestjs/common';
import e, { Request } from 'express';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from "bcrypt";
import { TokenExpiredError } from '@nestjs/jwt';
import createDto from './dto/create.dto';
import updateDto from './dto/update-user.dto';
import { IsOptional, IsString } from 'class-validator';


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }
  //lấy loại người dùng
  async getAllRoles() {
    return this.prisma.user_roles.findMany();
  }
  //lấy tất cả người dung
  async getAllUsers() {
    return this.prisma.users.findMany()
  }
  //lấy tất cả người dùng theo phân trang
  async getAllUserPage(page: string, pageSize: string) {
    const pages = +page > 0 ? +page : 1;
    const pageSizes = +pageSize > 0 ? +pageSize : 1;

    const totalItem = await this.prisma.users.count();

    const totalPages = Math.ceil(totalItem / pageSizes);

    const skip = (pages - 1) * pageSizes;


    const users = await this.prisma.users.findMany({
      skip: skip,
      take: pageSizes,
    });

    return {
      users,
      totalItem,
      totalPages,
      currentPage: pages,
      pageSize: pageSizes,
    };
  }
  //tìm kiếm người dùng
  async findUser(tuKhoa: string) {
    const allUser = await this.prisma.users.findMany()
    if (!tuKhoa) {
      return allUser
    } else {
      const filterData = allUser.filter((item) => item.user_name.toLowerCase().includes(tuKhoa))
      return filterData
    }
  }
  //tìm người dùng phân trang
  async findUserPage(tuKhoa: string, page: string, pageSize: string) {
    const allUser = await this.prisma.users.findMany();

    const filterData = allUser.filter((item) =>
      item.user_name.toLowerCase().includes(tuKhoa.toLowerCase()),
    );

    const totalItem = filterData.length;
    const pages = +page > 0 ? +page : 1;
    const pageSizes = +pageSize > 0 ? +pageSize : 1;
    const totalPages = Math.ceil(totalItem / pageSizes);

    const skip = (pages - 1) * pageSizes;
    const paginatedData = filterData.slice(skip, skip + pageSizes);

    return {
      users: paginatedData,
      totalItem,
      totalPages,
      currentPage: pages,
      pageSize: pageSizes,
    };
  }
  //Lấy thông tin cá nhân
  async getInfo(req: Request) {
    if (!req.user) throw new BadRequestException("Yêu cầu đăng nhập")
    const user = await this.prisma.users.findFirst({
      where: {
        user_id: req.user["user_id"]
      }
    })
    return user
  }
  //lấy thông tin người dùng
  async getInfoUser(req: Request, email: string) {
  
    const role_id = req.user["role_id"];
    if (role_id !== 1) throw new ForbiddenException("Yêu cầu quyền quản trị viên");

    const user = await this.prisma.users.findFirst({
      where: {
        email
      },
      include: {
        user_roles: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    return user;
  }
  //them nguoi dung
  async addUser(req: Request, createDto: createDto) {
    const roleAdmin = req.user["role_id"];
    if (roleAdmin !== 1) throw new ForbiddenException("Yêu cầu quyền quản trị viên");
    const { email, pass_word, phone, user_name, account, role_id } = createDto
    const userExists = await this.prisma.users.findFirst({
      where: {
        email: email,
      },
      select: {
        user_id: true,
        pass_word: true,
        phone: true,
        user_name: true,
        account: true,
        role_id: true
      }

    })
    if (userExists) throw new BadRequestException(`Email đã ton tai, vui long chọn email khác`)

    const hassPassword = bcrypt.hashSync(pass_word, 10)

    const userRegister = await this.prisma.users.create({
      data: {
        email: email,
        pass_word: hassPassword,
        phone: phone,
        user_name: user_name,
        role_id: role_id,
        account: account
      }
    })

    return userRegister
  }
  //cập nhật (admin thì có thể thay đổi của người khác, user thì không )
  async updateUser(req: Request, updateDto: updateDto) {
    const roleAdmin = req.user["role_id"];
    const userId = req.user["user_id"];
    const { email, pass_word, phone, user_name, account, role_id } = updateDto;
    if (roleAdmin !== 1 && role_id && role_id !== 2) {
      throw new ForbiddenException(
        "Người dùng thường không Có quyền thay đổi role_id"
      );
    }
    const userToUpdate = await this.prisma.users.findFirst({
      where: { email: email },
      select: {
        user_id: true,
        email: true,
        pass_word: true,
        role_id: true,
        account: true,
        phone: true
      }
    });
    if (!userToUpdate) {
      throw new BadRequestException("Người dùng không tồn tại");
    }
    if (roleAdmin !== 1 && userToUpdate.user_id !== userId) {
      throw new ForbiddenException(
        "Bạn không có quyền cập nhật tài khoản của người khác"
      );
    }
    const hashedPassword = pass_word
      ? bcrypt.hashSync(pass_word, 10)
      : userToUpdate.pass_word;
    const updatedUser = await this.prisma.users.update({
      where: { user_id: userToUpdate.user_id },
      data: {
        email,
        pass_word: hashedPassword,
        phone,
        user_name,
        role_id: roleAdmin === 1 ? role_id : userToUpdate.role_id,
        account: account
      },
    });
    return updatedUser;
  }

  async deleteUser(req: Request, email: string) {
    const roleAdmin = req.user["role_id"];
    if (roleAdmin !== 1) throw new ForbiddenException("Yêu cầu quyền quản trị viên");
    const userToDelete = await this.prisma.users.findFirst({
      where: { email: email },
      select: {
        user_id: true,
      }
    });
    const deleteUser = await this.prisma.users.delete({
      where: {
        user_id: userToDelete.user_id
      }
    })
    return deleteUser
  }
}
