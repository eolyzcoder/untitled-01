import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'

aws.config.setPromisesDependency()
aws.config.update({
  region: process.env.AWSREGION,
  apiVersion: 'latest',
  accessKeyId: process.env.AWSACCESSKEY,
  secretAccessKey: process.env.AWSSECRETKEY,  
})
const s3 = new aws.S3()

export const uploadFile = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET,
    Acl: process.env.ACL,
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
      })
    },
    key: function (req, file, cb) {
      cb(
        null,
        'public/' + file.originalname
      )
    },
  }),
  limits: { fileSize: 1024 * 1024 * 100 },
})
