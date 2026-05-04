/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Kegiatans } from './kegiatans.entity';
import { TerminChat } from './termin-chat.entity';

@Entity('t_termin')
export class Termin {
  @PrimaryGeneratedColumn()
  id_termin: number;

  @Column()
  nama_termin: string;

  @Column({ type: 'text', nullable: true })
  deskripsi: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  jumlah_pembayaran: number;

  @Column({ name: 'file_dokumentasi', nullable: true })
  file_dokumentasi: string;

  @Column({ name: 'nama_file_dokumentasi', nullable: true })
  nama_file_dokumentasi: string;

  @Column({ default: 'pending' })
  status: string;

  @Column()
  id_kegiatans: number;

  @ManyToOne(() => Kegiatans, (kegiatans) => kegiatans.termin, { onDelete: 'CASCADE' })
  kegiatans: Kegiatans;

  @OneToMany(() => TerminChat, (chat) => chat.termin)
  chats: TerminChat[];

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}