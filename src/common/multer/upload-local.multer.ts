import { diskStorage } from 'multer';
//tao ra path name day du
import * as path from 'path'
//tao ra folders  
import * as fs from "fs"
//auto tao ra folder khi chay, recursive de ngan tao neu da co roi
fs.mkdirSync('images/',{recursive: true})
const storageLocal = diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    let fileExtention = path.extname(file.originalname)
    if(fileExtention === '.jfif'){
        fileExtention = '.png'
    }
    const fileName ="local" + "-" + uniqueSuffix + fileExtention
      cb(null, fileName )
    }
  })
  


export default storageLocal