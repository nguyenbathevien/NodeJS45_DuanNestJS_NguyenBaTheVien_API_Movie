import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseMessage } from 'src/common/decorater/response-message.decorater';
import { Request } from 'express';
import createDto from './dto/create.dto';
import updateDto from './dto/update-user.dto';
import { ApiHeader, ApiProperty, ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';

import { Public } from 'src/common/decorater/public.decorater';
import { IsOptional, IsString } from 'class-validator';



@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('roles')
  @ResponseMessage(`Lấy danh sách loại người dùng thành công`)
  async getAllRoles() {
    const roles = await this.userService.getAllRoles();
    return roles
  }
  @Public()
  @Get('allUsers')
  @ResponseMessage(`Lấy danh sách người dùng thành công`)
  async getAllUsers() {
    const listUsers = await this.userService.getAllUsers()
    return listUsers
  }
  
  @Public()
  @Get("allUsersPage")
  @ResponseMessage(`Lấy danh sách người phân trnag dùng thành công`)
  async getAllUserPage(@Query(`page`) page : string,
  @Query(`pageSize`) pageSize : string) {
    const listUsers =  await this.userService.getAllUserPage(page, pageSize)
    return listUsers
  }
  @Public()
  @ApiQuery({required:false, name:"tuKhoa"})
  @Get("findUser")
  @ResponseMessage(`Tim người dùng thành công`)
  async findUser(@Query(`tuKhoa`) tuKhoa : string) {
  const listUsers =  await this.userService.findUser(tuKhoa?.toLowerCase())
      return listUsers
  }
  
  @Public()
  @Get("findUserPage")
  @ResponseMessage(`Tim người dùng phân trang thành công`)
  @ApiQuery({required:false, name:"tuKhoa"})
  async findUserPage(@Query(`tuKhoa`) tuKhoa : string,@Query(`page`) page : string,
  @Query(`pageSize`) pageSize : string) {
  const listUsers =  await this.userService.findUserPage(tuKhoa.toLowerCase(),page,pageSize)
      return listUsers
  }
  
  @Get("getInfo")
  @ResponseMessage(`Lấy thông tin cá nhân thành công`)
  async getInfo(@Req() req: Request){
    const infoUser = await this.userService.getInfo(req)
    return infoUser
  }

  @Get("getInfoUser")
  @ResponseMessage(`Lấy thông tin tài khoản thành công`)
  async getInfoUser(@Req() req: Request, @Query(`email`) email: string){
    const infoUser = await this.userService.getInfoUser(req,email)
    return infoUser
  }

  @Post("addUser")
  @ResponseMessage(`Thêm tài khoản người dùng thành công`)
  async addUser(@Req() req: Request, @Body() createDto: createDto){
    const newUser = await this.userService.addUser(req, createDto)
    return newUser
  }

  @Put("updateUser")
  @ResponseMessage(`Cập nhật tài khoản người dùng thành công`)
  async updateUser(@Req() req: Request, @Body() updateDto: updateDto){
    const updateUser = await this.userService.updateUser(req, updateDto)
    return updateUser
  }

  @Delete("deleteUser")
  @ResponseMessage(`Xóa tài khoản người dùng thành công`)
  async deleteUser(@Req() req: Request,@Query(`email`) email: string){
    const deleteUser = await this.userService.deleteUser(req, email)
    return deleteUser
  }
}
