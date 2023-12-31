import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Teacher } from 'src/domain/entities/Teacher';
import { TeacherRepository } from 'src/domain/repositories/TeacherRepository';
import { PrismaTeacherMapper } from '../mappers/PrismaTeacherMapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTeacherRepository implements TeacherRepository {
  constructor(private prisma: PrismaService) {}

  async create(teacher: Teacher): Promise<Teacher> {
    const userExists = await this.prisma.teacher.count({
      where: { email: teacher.email },
    });

    if (userExists > 0) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const raw = await this.prisma.teacher.create({
      data: PrismaTeacherMapper.toPrisma(teacher),
    });

    return PrismaTeacherMapper.toDomain(raw);
  }

  async getById(id: string): Promise<Teacher> {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    if (!teacher) {
      throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
    }

    return PrismaTeacherMapper.toDomain(teacher);
  }
}
