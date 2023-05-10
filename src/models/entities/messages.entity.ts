import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'messages' })
export class MessagesEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    default: false
  })
  success!: boolean;

  @Column('varchar', {
    length: 15
  })
  clientCode!: string;

  @Column('varchar', {
    length: 3
  })
  status!: string;

  @Column('varchar', {
    length: 250
  })
  message!: string;

  @Column('varchar', {
    length: 10
  })
  language!: string;

  @Column('varchar', {
    nullable: true,
    length: 100
  })
  errorServerCode!: string;

  @Column('text', {
    nullable: true
  })
  errorDetail!: string;

  @CreateDateColumn({
    type: 'timestamp'
  })
  createdAt!: Date;

  @Column('int8')
  createdBy!: number;

  @Column('timestamp', {
    nullable: true
  })
  updatedAt!: Date;

  @Column('int8', {
    nullable: true
  })
  updatedBy!: number;
}
