import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(name: string) {
    let player = await this.prisma.player.findUnique({
      where: { name },
    });

    if (!player) {
      player = await this.prisma.player.create({
        data: { name },
      });
    }

    return player;
  }

  async findAll() {
    return this.prisma.player.findMany({
      orderBy: { score: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.player.findUnique({
      where: { id },
    });
  }

  async updateScore(id: number, scoreChange: number) {
    const player = await this.prisma.player.findUnique({ where: { id } });
    if (!player) return null;

    return this.prisma.player.update({
      where: { id },
      data: { score: player.score + scoreChange },
    });
  }

  async setScore(id: number, score: number) {
    return this.prisma.player.update({
      where: { id },
      data: { score },
    });
  }

  async resetAllScores() {
    return this.prisma.player.updateMany({
      data: { score: 0 },
    });
  }

  async deleteAll() {
    return this.prisma.player.deleteMany();
  }
}

