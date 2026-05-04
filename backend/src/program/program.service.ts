/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from './entities/program.entity';
import { Fase } from './entities/fase.entity';
import { Kegiatans } from './entities/kegiatans.entity';
import { CreateProgramDto } from './dto/create-program.dto';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
    @InjectRepository(Fase)
    private readonly faseRepo: Repository<Fase>,
    @InjectRepository(Kegiatans)
    private readonly kegiatansRepo: Repository<Kegiatans>,
  ) {}

  async create(
    createProgramDto: CreateProgramDto,
    file: Express.Multer.File,
    id_user: number,
  ) {
    const queryRunner = this.programRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // --- 🔍 BAGIAN DEBUGGING (Lihat di Terminal VS Code) ---
      console.log('--- [DEBUG] DATA DARI FRONTEND ---');
      console.log('User ID:', id_user);
      console.log('Raw id_sekolah:', createProgramDto.id_sekolah);
      console.log('Raw id_pengawas:', createProgramDto.id_pengawas);
      console.log('Hasil Konversi ke Number:', {
        sekolah: Number(createProgramDto.id_sekolah),
        pengawas: Number(createProgramDto.id_pengawas),
        tahun: Number(createProgramDto.tahun),
      });

      // 1. Siapkan Objek Program dengan validasi angka aman (Anti-NaN)
      const newProgramData = this.programRepo.create({
        ...createProgramDto,
        // Jika hasil konversi adalah NaN, kita paksa jadi null agar DB tidak Error 500
        id_sekolah:
          createProgramDto.id_sekolah &&
          !isNaN(Number(createProgramDto.id_sekolah))
            ? Number(createProgramDto.id_sekolah)
            : null,

        id_pengawas:
          createProgramDto.id_pengawas &&
          !isNaN(Number(createProgramDto.id_pengawas))
            ? Number(createProgramDto.id_pengawas)
            : null,

        tahun:
          createProgramDto.tahun && !isNaN(Number(createProgramDto.tahun))
            ? Number(createProgramDto.tahun)
            : null,

        dibuat_oleh: id_user,
        file_mou: file ? file.filename : null,
      });

      const savedProgram = await queryRunner.manager.save(newProgramData);

      // 2. Simpan Fases & Kegiatans (Data sudah di-parsing otomatis oleh DTO)
      if (createProgramDto.fases && createProgramDto.fases.length > 0) {
        for (const fData of createProgramDto.fases) {
          // ✨ GUARD 1: Lewati jika objek fase kosong atau nama_fase tidak ada
          // Ini mencegah error "null value violates not-null constraint"
          if (!fData || !fData.nama_fase || fData.nama_fase.trim() === '') {
            console.warn(
              '⚠️ Menemukan objek fase kosong, melewati proses simpan fase ini.',
            );
            continue;
          }

          const fase = this.faseRepo.create({
            nama_fase: fData.nama_fase.trim(),
            deskripsi: fData.deskripsi || null,
            urutan: Number(fData.urutan) || 0,
            id_program: savedProgram.id_program,
          });

          // Simpan fase menggunakan queryRunner agar masuk ke dalam transaksi yang sama
          const savedFase = await queryRunner.manager.save(fase);

          // Cek apakah ada kegiatan di dalam fase ini
          if (fData.kegiatans && fData.kegiatans.length > 0) {
            for (const kegData of fData.kegiatans) {
              // ✨ GUARD 2: Lewati jika nama_kegiatans kosong
              if (
                !kegData ||
                !kegData.nama_kegiatans ||
                kegData.nama_kegiatans.trim() === ''
              ) {
                continue;
              }

              const kegiatans = this.kegiatansRepo.create({
                nama_kegiatans: kegData.nama_kegiatans.trim(),
                deskripsi: kegData.deskripsi || null,
                urutan: Number(kegData.urutan) || 0,
                id_fase: savedFase.id_fase,
              });

              // Simpan kegiatan menggunakan queryRunner
              await queryRunner.manager.save(kegiatans);
            }
          }
        }
      }

      await queryRunner.commitTransaction();
      return savedProgram;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('--- [ERROR] TRANSACTION CREATE ---');
      console.error('Pesan Error:', error.message);
      throw new InternalServerErrorException(
        `Gagal simpan program: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(kategori?: string) {
    try {
      return await this.programRepo.find({
        where: kategori ? { kategori } : {},
        order: { created_at: 'DESC' },
      });
    } catch (error) {
      console.error('--- [ERROR] DATABASE FINDALL ---', error.message);
      throw new InternalServerErrorException('Gagal mengambil data program');
    }
  }

  async findOne(id: number) {
    try {
      return await this.programRepo.findOne({
        where: { id_program: id },
        relations: [
          'fases',
          'fases.kegiatans',
          'fases.kegiatans.termin',
          'fases.kegiatans.termin.chats',
        ],
      });
    } catch (error) {
      throw new InternalServerErrorException('Data program tidak ditemukan');
    }
  }

  async update(
    id: number,
    updateData: any,
    file: Express.Multer.File,
    id_user: number,
  ) {
    try {
      const dataToSave = { ...updateData };
      if (file) dataToSave.file_mou = file.filename;

      await this.programRepo.update(id, dataToSave);
      return this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Gagal update program');
    }
  }

  remove(id: number) {
    return this.programRepo.delete(id);
  }
}
