import { UserService } from './user.service'
import { UpdateUserDto, GetUserDto, collectDto } from './dto/user.dto'
import { JwtGuard } from 'src/guards/jwt.guard'
import { Request } from 'express'
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req
} from '@nestjs/common'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // async create(@Body() createUserDto: CreateUserDto) {
  //   const user = await this.findAll({ username: createUserDto.username })
  //   if (user.length) {
  //     throw new HttpException(`${createUserDto.username} already exists.`, 400)
  //   }
  //   return this.userService.create(createUserDto)
  // }

  @Get()
  findAll(@Query() query: GetUserDto) {
    return this.userService.findAll(query)
  }

  @Get('getMyProfile')
  @UseGuards(JwtGuard)
  getMyProfile(@Req() req: Request) {
    const { userId } = req.user as any
    return this.findOne(userId)
  }

  @Patch('modifyMyProfile')
  @UseGuards(JwtGuard)
  modifyMyProfile(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const { userId } = req.user as any
    return this.update(userId, updateUserDto)
  }

  @Get('getCreatorProfile/:id')
  getCreatorProfile(@Param('id') id: string) {
    return this.userService.getCreatorProfile(+id)
  }

  @Post('subscribe')
  @UseGuards(JwtGuard)
  subscribe(@Body() body: { creatorId: string }, @Req() req: Request) {
    const { userId } = req.user as any
    return this.userService.subscribe(+userId, +body.creatorId)
  }

  @Get('subscribe/:id')
  @UseGuards(JwtGuard)
  getSubscriptions(@Param('id') creatorId: string, @Req() req: Request) {
    const { userId } = req.user as any
    return this.userService.subscribe(+userId, +creatorId, true)
  }

  @Get('following')
  @UseGuards(JwtGuard)
  getMyFollowing(
    @Req() req: Request,
    @Query() query: { page?: string; limit?: string }
  ) {
    const { userId } = req.user as any
    return this.userService.getMyFollowing(+userId, {
      page: +query.page,
      limit: +query.limit
    })
  }

  @Get('followers')
  @UseGuards(JwtGuard)
  getMyFollowers(
    @Req() req: Request,
    @Query() query: { page?: string; limit?: string }
  ) {
    const { userId } = req.user as any
    return this.userService.getMyFollowers(+userId, {
      page: +query.page,
      limit: +query.limit
    })
  }

  //移除订阅更新通知
  @Patch('removeNewPostNotification/:id')
  @UseGuards(JwtGuard)
  removeNewPostNotification(
    @Param('id') creatorId: string,
    @Req() req: Request
  ) {
    const { userId } = req.user as any
    return this.userService.removeNewPostNotification(+creatorId, userId)
  }

  @Get('collect')
  @UseGuards(JwtGuard)
  getMyCollect(@Req() req: Request, @Query() query: { page?: string; limit?: string }) {
    const { userId } = req.user as any
    return this.userService.getMyCollect(+userId, query)
  }
  //收藏视频
  @Post('collect')
  @UseGuards(JwtGuard)
  addCollect(@Body() { postId }: collectDto, @Req() req: Request) {
    const { userId } = req.user as any
    return this.userService.addCollect(+userId, +postId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
