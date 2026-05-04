/* eslint-disable prettier/prettier */
import {
  IsNumber,
  IsArray,
  ValidateNested,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class QuestionDto {
  @IsString()
  question: string;

  @IsArray()
  options: string[];
}

export class CreateAssessmentDto {
  @IsNumber()
  id_ho: number;

  @IsString()
  nama: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];

  /**
   * REVISI DI SINI:
   * Kita hapus id_sekolah (tunggal)
   * Ganti dengan target_sekolah_ids (Array Number)
   */
  @IsArray()
  @IsNumber({}, { each: true }) // Memastikan setiap isi array adalah angka
  @IsOptional()
  target_sekolah_ids: number[];

  @IsNumber()
  @IsOptional()
  tenggat: number;

  @IsString()
  @IsOptional()
  jenis: string;
}
