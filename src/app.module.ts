import { Global, Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import * as dotenv from 'dotenv'
import * as Joi from 'joi'
import { TypeOrmModule } from '@nestjs/typeorm'
import { connectionParams } from 'ormconfig'
import { PostsModule } from './posts/posts.module'
import { AuthModule } from './auth/auth.module'
import { FileModule } from './file/file.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { CommentsModule } from './comments/comments.module';

@Global()
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public')
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || `development`}`,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_PORT: Joi.number().default(3306),
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain()
        ),
        DB_TYPE: Joi.string().valid('mysql', 'postgres'),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        LOG_ON: Joi.boolean(),
        LOG_LEVEL: Joi.string()
      })
    }),
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
    PostsModule,
    AuthModule,
    FileModule,
    CommentsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
