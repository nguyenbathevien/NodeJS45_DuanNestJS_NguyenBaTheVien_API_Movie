import multer from 'multer';
//tao ra path name day du
import path from 'path'
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({   
    cloud_name: 'dkeena4ef', 
    api_key: '669493951555893', 
    api_secret: 'kwS9ZURevg43oplrwMwx0YC4rOo' // Click 'View API Keys' above to copy your API secret
});
const storageCloud = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'images', //quy dinh tren trang web khong giong tren local
    }as any,
  });
  

export default storageCloud