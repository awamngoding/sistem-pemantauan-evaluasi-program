/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Termin } from './entities/termin.entity';
import { TerminChat } from './entities/termin-chat.entity';

@Injectable()
export class TerminService {
  constructor(
    @InjectRepository(Termin)
    private readonly terminRepo: Repository<Termin>,
    @InjectRepository(TerminChat)
    private readonly chatRepo: Repository<TerminChat>,
  ) {}

  async createTermin(
    createDto: any,
    file: Express.Multer.File,
    id_user: number,
    nama_user: string,
    role_user: string,
  ) {
    try {
      const termin = this.terminRepo.create({
        nama_termin: createDto.nama_termin,
        deskripsi: createDto.deskripsi || null,
        jumlah_pembayaran: createDto.jumlah_pembayaran ? Number(createDto.jumlah_pembayaran) : 0,
        id_kegiatans: Number(createDto.id_kegiatans),
        status: 'pending',
        file_dokumentasi: file ? file.filename : null,
        nama_file_dokumentasi: file ? file.originalname : null,
      });

      return await this.terminRepo.save(termin);
    } catch (error) {
      console.error('Error saat save termin:', error);
      throw new InternalServerErrorException('Gagal menyimpan termin!');
    }
  }

  async getTerminsByKegiatans(id_kegiatans: number) {
    return await this.terminRepo.find({
      where: { id_kegiatans },
      order: { created_at: 'ASC' },
      relations: ['chats'],
    });
  }

  async createChat(
    createDto: any,
    id_user: number,
    nama_user: string,
    role_user: string,
  ) {
    try {
      const chat = this.chatRepo.create({
        pesan: createDto.pesan,
        id_user,
        nama_user,
        role_user,
        id_termin: Number(createDto.id_termin),
      });

      return await this.chatRepo.save(chat);
    } catch (error) {
      console.error('Error saat save chat:', error);
      throw new InternalServerErrorException('Gagal mengirim pesan!');
    }
  }

  async getChatsByTermin(id_termin: number) {
    return await this.chatRepo.find({
      where: { id_termin },
      order: { created_at: 'ASC' },
    });
  }
}