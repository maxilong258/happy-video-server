import { HttpException, Module } from '@nestjs/common'
import { FileController } from './file.controller'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import * as nuid from 'nuid'
import * as fs from 'fs'

const image = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'webp']
const video = ['mp4', 'webm']

const checkDirAndCreate = (filePath) => {
  const pathArr = filePath.split('/')
  let checkPath = '.'
  let item: string
  for (item of pathArr) {
    checkPath += `/${item}`
    if (!fs.existsSync(checkPath)) {
      fs.mkdirSync(checkPath)
    }
  }
}

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        // 配置文件上传后的文件夹路径
        destination: (req, file, cb) => {
          const filePath = `public/uploads/${req.body.type}/${new Date()
            .toLocaleString('en-US')
            .split(',')[0]
            .split('/')
            .join('-')}`
          checkDirAndCreate(filePath) // 判断文件夹是否存在，不存在则自动生成
          return cb(null, `./${filePath}`)
        },
        filename: (req, file, cb) => {
          const filename = `${nuid.next()}.${file.mimetype.split('/')[1]}`
          return cb(null, filename)
        }
      }),
      fileFilter(req, file, cb) {
        if (!req.body.type) {
          return cb(new HttpException('Please provide the type', 400), false)
        }
        if (
          req.body.type !== 'video' &&
          req.body.type !== 'video-cover' &&
          req.body.type !== 'painting' &&
          req.body.type !== 'avatar' &&
          req.body.type !== 'background'
        ) {
          return cb(
            new HttpException('Please provide the correct type', 400),
            false
          )
        }
        const mimeType = file.mimetype.split('/')[1].toLowerCase()
        let temp = 'other'
        image.filter((item) => item === mimeType).length > 0
          ? (temp = 'image')
          : ''
        video.filter((item) => item === mimeType).length > 0
          ? (temp = 'video')
          : ''
        if (temp === 'other') {
          return cb(new HttpException('wrong file format', 400), false)
        }
        return cb(null, true)
      }
    })
  ],
  controllers: [FileController],
  providers: []
})
export class FileModule {}
