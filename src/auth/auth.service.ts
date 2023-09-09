import {
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { SigninDto, SignupDto } from './dto/auth.dto'
import * as argon2 from 'argon2'
// import nodemailer from 'nodemailer'

// var transporter = nodemailer.createTransport({
//   service: 'qq',
//   auth: {
//     user: '1948487742@qq.com',
//     pass: '5517032520'
//   }
// })

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwt: JwtService) {}
  async me(token: string) {
    try {
      const decodedToken = await this.jwt.verifyAsync(token)
      const user = await this.userService.findOne(decodedToken.sub)
      const data = {
        ...user,
        token
      }
      return data
    } catch (error) {
      // 如果token无效，则抛出UnauthorizedException异常
      throw new UnauthorizedException('Invalid token')
    }
  }

  async signin(dto: SigninDto) {
    const { email, password } = dto
    const user = await this.userService.findUserForAuth(email)
    if (!user) throw new ForbiddenException('User not found')
    const isPasswordValid = await argon2.verify(user.userPassword.password, password)
    if (!isPasswordValid) throw new ForbiddenException('invalid email or password')
    const token = await this.jwt.signAsync({
      username: user.username,
      sub: user.id
    })
    const data = {
      ...user,
      token
    }
    return data
  }

  async signup(dto: SignupDto) {
    const { username, email, password } = dto
    let check = null
    check = await this.userService.findByUsername(username)
    if (check) throw new ForbiddenException('User already exist')
    check = await this.userService.findUserForAuth(email)
    if (check) throw new ForbiddenException('Email is already in use')

    // transporter.sendMail({
    //   from: '1948487742@qq.com',
    //   to: email,
    //   subject: 'thankyou for singup',
    //   html: '<a href="http://localhost:5173/">to main site</a>'
    // }, (err) => {
    //   if (err) throw new HttpException(err, 500)
    // })

    const newUser = await this.userService.create({
      username,
      email,
      password
    })
    const token = await this.jwt.signAsync({
      username: newUser.username,
      sub: newUser.id
    })
    const data = {
      ...newUser,
      token
    }
    return data
  }
}
