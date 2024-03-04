import express from 'express';

import { createMessage, createThread, uploadPdf } from '../controllers/upload';
import { multerUpload } from '../middleware/multer';

const gptRoutes = express.Router();

gptRoutes.post('/upload', multerUpload.single('file'), uploadPdf);

gptRoutes.post('/create-thread', createThread);
gptRoutes.post('/create-message', createMessage);

export default gptRoutes;
