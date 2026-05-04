/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Program } from './program.entity';
import { Kegiatans } from './kegiatans.entity';

@Entity('t_fase')
export class Fase {
  @PrimaryGeneratedColumn()
  id_fase: number;

  @Column()
  nama_fase: string;

  @Column({ nullable: true })
  deskripsi: string;

  @Column()
  urutan: number;

  @Column()
  id_program: number;

  @ManyToOne(() => Program, (program) => program.fases, { onDelete: 'CASCADE' })
  program: Program;

  @OneToMany(() => Kegiatans, (kegiatans) => kegiatans.fase)
  kegiatans: Kegiatans[];
}