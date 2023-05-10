import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'messages' })
export class PayloadLogEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    default: false
  })
  success!: boolean;

  @Column('varchar', {
    length: 15
  })
  payload!: string;

  @CreateDateColumn({
    type: 'timestamp'
  })
  createdAt!: Date;

  @Column('int8')
  createdBy!: number;


}
