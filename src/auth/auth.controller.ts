import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, Patch, Req, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOAuth2, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/type.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { RoleEnum } from 'src/config/contants';
import { Roles } from './roles.decorator';
import { UsersService } from 'src/users/users.service';
import { GetUserDto } from 'src/users/dto/create-user.dto';
import { Public } from './public.decorator';
import { GoogleAuthGuard } from './google.guard';
@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiProperty({ title: 'login', type: LoginDto })
  @ApiOperation({ summary: 'log in' })
  @ApiBody({
    schema: {
      example: {
        email: 'dynann@gmail.com',
        password: 'hashedpassword',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    const tokens = await this.authService.login(loginDto)
    return tokens
  }

  @ApiProperty({ title: 'get my profile' , type: GetUserDto })
  @ApiResponse({ status: 200, type: GetUserDto })
  @Get('me')
  async getMe(@Request() req){
    return this.userService.findOne(req.user.sub);
  }

  
  @Patch('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return await this.authService.logout(req.user.sub);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'generate new access token'})
  @ApiBody({
    schema: {
      example: {
        refreshToken: 'string',
      },
    },
  })
  @ApiOperation({ summary: 'refresh token' })
  async refresh(@Body() body: { refreshToken: string }) {
    const token = await this.authService.refreshToken(body.refreshToken);
    return token;
  }

  @Get('user')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER)
  @HttpCode(HttpStatus.OK)
  async testUser(@Request() req) {
    console.log(req.user.sub);
    return 'Allow Access!';
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async testAdmin() {
    return 'Allow Access!';
  }

  @Public()
  @Post('/google')
  async googleAuthRedirect(@Req() req) {
    console.log(req.body)
    return this.authService.validateGoogleToken(req.body.idToken)
  }
}
