import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigEnum } from "src/enum/config.enum";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(ConfigEnum.SECRET)
    })
  }
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username }
  }
}