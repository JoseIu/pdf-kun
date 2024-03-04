import multer from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const CURRENT_DIR = __dirname;
const MINETYPES = ['image/png', 'image/jpeg', 'application/pdf'];

export const multerUpload = multer({
  storage: multer.diskStorage({
    destination: join(CURRENT_DIR, '../../uploads'),
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;

      return cb(null, fileName);
    }
  }),

  fileFilter: (req, file, cb) => {
    if (MINETYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Only ${MINETYPES.join(' ')} minetypes are allowed`));
  },
  limits: {
    fieldNameSize: 1000000
  }
});
