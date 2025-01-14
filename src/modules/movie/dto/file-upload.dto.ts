import { ApiProperty } from "@nestjs/swagger";

class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    image: any;
  }

  export default FileUploadDto
  