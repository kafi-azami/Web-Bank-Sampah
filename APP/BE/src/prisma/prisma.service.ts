
import 'dotenv/config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';


@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly pool: Pool;

  constructor() {
    const pool = new Pool({
      host: '3.132.12.55',
      port: 5432,
      database: 'neondb',
      user: 'neondb_owner',
      password: 'npg_p5WrzFkgUIm7',
      ssl: {
        rejectUnauthorized: false,
        servername: 'ep-hidden-paper-ae7xripb-pooler.c-2.us-east-2.aws.neon.tech',
      },
      max: 10,
      min: 2,
      idleTimeoutMillis: 5_000,
      connectionTimeoutMillis: 10_000,
      maxLifetimeSeconds: 300,
      keepAlive: true,
      keepAliveInitialDelayMillis: 5_000,
    });

    pool.on('error', (err) => {
      console.warn('Pool idle client error (diabaikan, akan reconnect otomatis):', err.message);
    });

    super({
      adapter: new PrismaPg(pool),
    });

    this.pool = pool;
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    await this.pool.end();
  }
}