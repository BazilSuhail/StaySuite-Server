import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './listing_images',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 500,
  },
};
