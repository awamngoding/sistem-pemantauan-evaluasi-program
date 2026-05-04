/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TerminService } from './termin.service';

@Controller('termin')
export class TerminController {
  constructor(private readonly terminService: TerminService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file_dokumentasi', {
      storage: diskStorage({
        destination: './uploads/dokumentasi',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `DOC-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  createTermin(
    @Body() createDto: any,
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Token tidak ada');
    }

    const token = authHeader.split(' ')[1];
    let id_user = null;
    let nama_user = '';
    let role_user = '';

    try {
      const payloadBase64Url = token.split('.')[1];
      const payloadBase64 = payloadBase64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString(
        'utf-8',
      );
      const payload = JSON.parse(payloadJson);
      id_user = payload.sub;
      nama_user = payload.nama || '';
      role_user = payload.role || '';
    } catch (e) {
      throw new UnauthorizedException('Token tidak valid');
    }

    return this.terminService.createTermin(createDto, file, id_user, nama_user, role_user);
  }

  @Get('kegiatans/:id')
  getTerminsByKegiatans(@Param('id') id: string) {
    return this.terminService.getTerminsByKegiatans(+id);
  }

  @Post('chat')
  createChat(
    @Body() createDto: any,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Token tidak ada');
    }

    const token = authHeader.split(' ')[1];
    let id_user = null;
    let nama_user = '';
    let role_user = '';

    try {
      const payloadBase64Url = token.split('.')[1];
      const payloadBase64 = payloadBase64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString(
        'utf-8',
      );
      const payload = JSON.parse(payloadJson);
      id_user = payload.sub;
      nama_user = payload.nama || '';
      role_user = payload.role || '';
    } catch (e) {
      throw new UnauthorizedException('Token tidak valid');
    }

    return this.terminService.createChat(createDto, id_user, nama_user, role_user);
  }

  @Get('chat/:id_termin')
  getChatsByTermin(@Param('id_termin') id_termin: string) {
    return this.terminService.getChatsByTermin(+id_termin);
  }
}