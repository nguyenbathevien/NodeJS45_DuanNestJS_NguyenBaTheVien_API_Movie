import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MovieDto } from './dto/movie.dto';
import { Request } from 'express';

@Injectable()
export class MovieService {
    constructor(private readonly prisma: PrismaService) {}
    // lấy danh sách banner
    async getAllBanner(){
        return await this.prisma.banners.findMany()
    }
    //lấy danh sách movie
    async getAllMovie(){
        return await this.prisma.movies.findMany()
    }
    //lấy danh sách movie theo tên
    async getAllMovieName(nameMovie: string) {
        const allMovies = await this.prisma.movies.findMany();
    
        const normalizedQuery = nameMovie.replace(/\s+/g, '').toLowerCase();
    
        return allMovies.filter((movie) => {
            const normalizedMovieName = movie.movie_name.replace(/\s+/g, '').toLowerCase();
            return normalizedMovieName.includes(normalizedQuery);
        });
    }

    //lấy danh sách movie phân trang
    async getMoviePage(nameMovie: string, page: string, pageSize: string) {
        const pages = +page > 0 ? +page : 1; 
        const pageSizes = +pageSize > 0 ? +pageSize : 1; 
        
        // Chuẩn hóa chuỗi tìm kiếm: Loại bỏ khoảng trắng và chuyển về chữ thường
        const normalizedQuery = nameMovie ? nameMovie.replace(/\s+/g, '').toLowerCase() : '';
      
        // Đếm tổng số item khớp với điều kiện tìm kiếm
        const totalItem = await this.prisma.movies.count({
          where: {
            movie_name: {
              contains: normalizedQuery, // Tìm kiếm theo chuỗi chuẩn hóa
            },
          },
        });
      
        // Tính tổng số trang
        const totalPages = Math.ceil(totalItem / pageSizes);
      
        // Tính số lượng item cần bỏ qua
        const skip = (pages - 1) * pageSizes;
      
        // Lấy danh sách phim
        const movies = await this.prisma.movies.findMany({
          where: {
            movie_name: {
              contains: normalizedQuery,
            },
          },
          skip: skip, 
          take: pageSizes, 
        });
      
        return {
          movies,
          totalItem,
          totalPages,
          currentPage: pages,
          pageSize: pageSizes,
        };
      }
      

    //lấy danh sách movie phân trang theo ngày
    async getMoviePageByDate(nameMovie: string,page: string, pageSize: string,dateIn: string,dateOut: string) {
        const pages = +page > 0 ? +page : 1;
        const pageSizes = +pageSize > 0 ? +pageSize : 1; 
      
        const totalItem = await this.prisma.movies.count();
      
        const totalPages = Math.ceil(totalItem / pageSizes);
      
        const skip = (pages - 1) * pageSizes; 
        
      
        const movies = await this.prisma.movies.findMany({
            where: {
                movie_name: {
                    contains: nameMovie
                },
                release_date: {
                    gte: new Date(dateIn),
                    lte: new Date(dateOut)
                }
            },
          skip: skip, 
          take: pageSizes, 
        });
      
        return {
          movies,
          totalItem,
          totalPages,
          currentPage: pages,
          pageSize: pageSizes,
        };
      }

    async uploadMovie(createMovieDto: MovieDto,req: Request){
        
        if (req.user["role_id"] !== 1) throw new ForbiddenException(`Yêu cầu quyền quản trị viên`)
        const releaseDate = new Date(createMovieDto.release_date);

        if (isNaN(releaseDate.getTime())) {
            throw new BadRequestException("Ngày phát hành không hợp lệ");
        }
        const existingMovie = await this.prisma.movies.findFirst({
            where: {
                movie_name: createMovieDto.movie_name,
            },
        });
    
        if (existingMovie) {
            throw new BadRequestException(`Movie với tên "${createMovieDto.movie_name}" đã tồn tại`);
        }
        const newMovie = await this.prisma.movies.create({
            data: {
                movie_name: createMovieDto.movie_name,
                movie_trailer: createMovieDto.movie_trailer,
                is_hot: createMovieDto.is_hot,
                is_coming_soon: createMovieDto.is_coming_soon,
                is_showing: createMovieDto.is_showing,
                release_date: releaseDate,
                description: createMovieDto.description,
                rating: createMovieDto.rating
            }
    })
        return newMovie
      }

    async uploadImageMovie(file: Express.Multer.File,movieID: string,req: Request){
        
        if(!file) throw new BadRequestException("File không hợp lệ")
        if (req.user["role_id"] !== 1) throw new ForbiddenException(`Yêu cầu quyền quản trị viên`)
        const movie_id = +movieID
    
        const movieIDUpdte = await this.prisma.movies.findFirst({
            where: {
                movie_id: movie_id
            },
            select: {
                movie_id: true
            }
        })
        if(!movieIDUpdte) throw new BadRequestException(`Không thể tìm thấy movie với ID là ${movieID}`)
        const uploadImage = await this.prisma.movies.update({
            where:{
                movie_id: movieIDUpdte.movie_id
            },
            data: {
                movie_image: file.path 
            }
        })
    
        return uploadImage
      }

      async deleteMovie(idDelete: string, req: Request) {
        if (!idDelete) throw new BadRequestException("Vui lòng cung cấp Id movie cần xóa");
        if (req.user["role_id"] !== 1) throw new ForbiddenException(`Yêu cầu quyền quản trị viên`);
        try {
          await this.prisma.banners.deleteMany({ where: { movie_id: +idDelete } });
          const schedules = await this.prisma.schedules.findMany({
            where: { movie_id: +idDelete },
            select: { schedule_id: true },
          });
          const scheduleIds = schedules.map((schedule) => schedule.schedule_id);
          await this.prisma.bookings.deleteMany({
            where: { schedule_id: { in: scheduleIds } },
          });
          await this.prisma.schedules.deleteMany({ where: { movie_id: +idDelete } });
          const delMovie = await this.prisma.movies.delete({ where: { movie_id: +idDelete } });
          return delMovie;
        } catch (error) {
          throw new InternalServerErrorException("Không thể xóa movie do lỗi cơ sở dữ liệu");
        }
      }
      

      async getMovie( idMovie: string){
        if(!idMovie) throw new BadRequestException("Vui lòng cung cấp id movie")
        try {
            return await this.prisma.movies.findUnique({where: {movie_id: +idMovie}})
        } catch (error) {
            throw new InternalServerErrorException("Lỗi khi lấy dữ liệu")
        }
      }
      async updateMovie( idMovie: string,req: Request,createMovieDto: MovieDto){
        if(!idMovie) throw new BadRequestException("Vui lòng cung cấp id movie")
        if (req.user["role_id"] !== 1) throw new ForbiddenException(`Yêu cầu quyền quản trị viên`);
        try {
            const releaseDate = new Date(createMovieDto.release_date);

        if (isNaN(releaseDate.getTime())) {
            throw new BadRequestException("Ngày phát hành không hợp lệ");
        }
        const updateMovie = await this.prisma.movies.update({
            where:{movie_id: +idMovie},
            data: {
                movie_name: createMovieDto.movie_name,
                movie_trailer: createMovieDto.movie_trailer,
                is_hot: createMovieDto.is_hot,
                is_coming_soon: createMovieDto.is_coming_soon,
                is_showing: createMovieDto.is_showing,
                release_date: releaseDate,
                description: createMovieDto.description,
                rating: createMovieDto.rating
            }
    })
        return updateMovie
        } catch (error) {
            throw new InternalServerErrorException("Lỗi khi lấy dữ liệu")
        }
      }
      
}
