/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Fase } from './fase.entity';
import { Termin } from './termin.entity';

@Entity('t_kegiatans')
export class Kegiatans {
  @PrimaryGeneratedColumn()
  id_kegiatans: number;

  @Column()
  nama_kegiatans: string;

  @Column({ nullable: true })
  deskripsi: string;

  @Column()
  urutan: number;

  @Column()
  id_fase: number;

  @ManyToOne(() => Fase, (fase) => fase.kegiatans, { onDelete: 'CASCADE' })
  fase: Fase;

  @OneToMany(() => Termin, (termin) => termin.kegiatans)
  termin: Termin[];
}