import { Body, Controller, Delete, Get, Post, Put, Query, Req,  UploadedFile, UseInterceptors } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ResponseMessage } from 'src/common/decorater/response-message.decorater';
import { FileInterceptor } from '@nestjs/platform-express';
import storageCloud from 'src/common/multer/upload-cloud.multer';
import { MovieDto } from './dto/movie.dto';
import { Request } from 'express';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import FileUploadDto from './dto/file-upload.dto';
import { Public } from 'src/common/decorater/public.decorater';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get("banner")
  @ResponseMessage(`Lấy danh sách banner thành công`)
  async getAllBanner() {
    const banner = await this.movieService.getAllBanner();
    return banner
  }

  @Public()
  @Get("getList")
  @ApiQuery({required:false,name:"nameMovie"})
  @ResponseMessage(`Lấy danh sách Movie thành công`)
  async getAllMovie(@Query("nameMovie") nameMovie?: string) {
  if (nameMovie) {
    return await this.movieService.getAllMovieName(nameMovie);
  }
  return await this.movieService.getAllMovie();
}

  @Public()
  @Get("getListPage")
  @ApiQuery({ name: "nameMovie", required: false, type: String })
  @ApiQuery({ name: "page", required: false, type: String,description:"default : 1" })
  @ApiQuery({ name: "pageSize", required: false, type: String,description:"default : 1" })
  @ResponseMessage(`Lấy danh sách Movie phân trang thành công`)
  async getMoviePage(@Query("nameMovie") nameMovie: string,@Query(`page`) page : string,
  @Query(`pageSize`) pageSize : string) {
  const listMovie =  await this.movieService.getMoviePage(nameMovie,page, pageSize)
    return listMovie
}
  @Public()
  @Get("getListPageByDate")
  @ResponseMessage(`Lấy danh sách Movie theo ngày thành công`)
  @ApiQuery({ name: "nameMovie", required: false, type: String })
  @ApiQuery({ name: "page", required: false, type: String,description:"default : 1" })
  @ApiQuery({ name: "pageSize", required: false, type: String,description:"default : 1" })
  @ApiQuery({ name: "dateIn", required: false, type: String,description:"yyyy/mm/dd" })
  @ApiQuery({ name: "dateOut", required: false, type: String,description:"yyyy/mm/dd" })
  async getMoviePageByDate(@Query("nameMovie") nameMovie: string,@Query(`page`) page : string,
  @Query(`pageSize`) pageSize : string,@Query(`dateIn`) dateIn: string,@Query(`dateOut`) dateOut: string) {
  const listMovie =  await this.movieService.getMoviePageByDate(nameMovie,page, pageSize,dateIn,dateOut)
    return listMovie
}
  
    @Post('addMovie')
    @ResponseMessage(`Thêm Movie thành công`)
  async uploadMovie(@Body() createMovieDto: MovieDto,@Req() req: Request) {
      return await this.movieService.uploadMovie(createMovieDto,req)
  }

    @Post('addImageMovie')
    @ResponseMessage(`Thêm hình cho Movie thành công`)
    @UseInterceptors(FileInterceptor('image',{
      storage: storageCloud
    }))
    @ApiConsumes('multipart/form-data')
@ApiBody({
  description: 'List of cats',
  type: FileUploadDto,
})
  async uploadImageMovie(@UploadedFile() file: Express.Multer.File,@Query(`movieID`) movieID: string,@Req() req: Request) {
      return await this.movieService.uploadImageMovie(file,movieID,req)
  }

    @Delete("deleteMovie")
    @ResponseMessage(`Xóa Movie thành công`)
    async deleteMovie(@Query(`id`) idDelete: string,@Req() req: Request) {
      return await this.movieService.deleteMovie(idDelete,req)
  }

  @Get("getMovieByID")
  @ResponseMessage(`Lấy thông tin film thành công`)
   async getMovie(@Query(`id`) idMovie: string){
    return await this.movieService.getMovie(idMovie)
   } 


   @Put("updateMovie")
  @ResponseMessage(`Sửa thông tin film thành công`)
  async updateMovie(@Query(`id`) idMovie: string,@Req() req: Request,@Body() createMovieDto: MovieDto){
    return await this.movieService.updateMovie(idMovie,req,createMovieDto)
   } 
  }
