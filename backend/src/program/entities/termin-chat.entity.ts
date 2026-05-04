/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Termin } from './termin.entity';

@Entity('t_termin_chat')
export class TerminChat {
  @PrimaryGeneratedColumn()
  id_chat: number;

  @Column({ type: 'text' })
  pesan: string;

  @Column()
  id_user: number;

  @Column({ nullable: true })
  nama_user: string;

  @Column({ nullable: true })
  role_user: string;

  @Column()
  id_termin: number;

  @ManyToOne(() => Termin, (termin) => termin.chats, { onDelete: 'CASCADE' })
  termin: Termin;

  @CreateDateColumn()
  created_at: Date;
}