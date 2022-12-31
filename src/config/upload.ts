import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
const uploadFolder = path.resolve(__dirname, '../uploads');

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',
  bucket: process.env.AWS_BUCKET_NAME || '',
  dest: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const filename = `${fileHash}-${file.originalname}`;
      callback(null, filename);
    },
  }),
};
