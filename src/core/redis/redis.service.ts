import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService
    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);

    private readonly client: Redis;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.client = new Redis({
            host: this.configService.getOrThrow<string>('redis.host'),

            port: this.configService.getOrThrow<number>(
                'redis.port',
            ),

            lazyConnect: true,

            maxRetriesPerRequest: 3,
        });

        this.client.on('error', (error) => {
            this.logger.error(
                'Redis connection error',
                error.stack,
            );
        });
    }

    async onModuleInit(): Promise<void> {
        await this.client.connect();

        const response = await this.client.ping();

        this.logger.log(
            `Redis connected: ${response}`,
        );
    }

    async onModuleDestroy(): Promise<void> {
        if (this.client.status === 'ready') {
            await this.client.quit();
        }
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(
        key: string,
        value: string,
        ttlSeconds?: number,
    ): Promise<void> {
        if (ttlSeconds) {
            await this.client.set(
                key,
                value,
                'EX',
                ttlSeconds,
            );

            return;
        }

        await this.client.set(key, value);
    }

    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }
}