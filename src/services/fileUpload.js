const multer = require('multer'),
  multerS3 = require('multer-s3');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

const courseMediaUpload = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: process.env.BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, `course-media/${Date.now()}-${file.originalname.replace(/\s/g, '')}`);
    },
  }),
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB hard cap (images validated in controller)
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  },
});

module.exports = {
  upload: multer({
    storage: multerS3({
      s3,
      acl: 'public-read',
      bucket: process.env.BUCKET_NAME,
      key: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.originalname.replaceAll(' ', '')}`);
      },
    }),
  }),
  courseMediaUpload,
  s3,
  DeleteObjectCommand,
};
