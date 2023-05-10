import { ConfigService } from '@nestjs/config';

interface IEnvironment {
  isDevelopment: boolean;
  isTargetProduction: boolean;
  isProduction: boolean;
  secretKeyAuth: string;
  apiKey: string;
  whiteListedOrigin: string;
  dbUser: {
    master: {
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
    };
    slave: {
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
    };
  };
  redis: {
    host: string;
    port: number;
    password: string;
    timeout: number;
  };
}

export default function EnvironmentConfig(): IEnvironment {
  const configService = new ConfigService();
  const isDevelopment = configService.get('NODE_ENV') === 'development';
  const isTargetProduction = configService.get('TARGET_ENV') === 'production';
  let payload;
  if (!isDevelopment) {
    const appSecret = JSON.parse(configService.get('APP_SECRET') || '{}');
    payload = Object.freeze(appSecret);
  } else {
    payload = Object.freeze({
      SECRET_KEY_AUTH: configService.get('SECRET_KEY_AUTH'),
      API_KEY: configService.get('API_KEY'),
      WHITELISTED_ORIGIN: configService.get('WHITELISTED_ORIGIN'),
      DB_USER_MASTER_HOST: configService.get('DB_USER_MASTER_HOST'),
      DB_USER_MASTER_PORT: configService.get('DB_USER_MASTER_PORT'),
      DB_USER_MASTER_USERNAME: configService.get('DB_USER_MASTER_USERNAME'),
      DB_USER_MASTER_PASSWORD: configService.get('DB_USER_MASTER_PASSWORD'),
      DB_USER_MASTER_DATABASE: configService.get('DB_USER_MASTER_DATABASE'),
      DB_USER_SLAVE_HOST: configService.get('DB_USER_SLAVE_HOST'),
      DB_USER_SLAVE_PORT: configService.get('DB_USER_SLAVE_PORT'),
      DB_USER_SLAVE_USERNAME: configService.get('DB_USER_SLAVE_USERNAME'),
      DB_USER_SLAVE_PASSWORD: configService.get('DB_USER_SLAVE_PASSWORD'),
      DB_USER_SLAVE_DATABASE: configService.get('DB_USER_SLAVE_DATABASE'),
      REDIS_HOST: configService.get('REDIS_HOST'),
      REDIS_PORT: configService.get('REDIS_PORT'),
      REDIS_PASSWORD: configService.get('REDIS_PASSWORD'),
      REDIS_TIMEOUT: configService.get('REDIS_TIMEOUT')
    });
  }

  return {
    isDevelopment,
    isProduction: !isDevelopment,
    isTargetProduction,
    secretKeyAuth: payload.SECRET_KEY_AUTH,
    apiKey: payload.API_KEY,
    whiteListedOrigin: payload.WHITELISTED_ORIGIN || 'http://localhost:3000',
    dbUser: {
      master: {
        host: payload.DB_USER_MASTER_HOST || '127.0.0.1',
        port: +payload.DB_USER_MASTER_PORT || 5432,
        username: payload.DB_USER_MASTER_USERNAME || 'root',
        password: payload.DB_USER_MASTER_PASSWORD || '',
        database: payload.DB_USER_MASTER_DATABASE || 'default'
      },
      slave: {
        host: payload.DB_USER_SLAVE_HOST || '127.0.0.1',
        port: +payload.DB_USER_SLAVE_PORT || 5432,
        username: payload.DB_USER_SLAVE_USERNAME || 'root',
        password: payload.DB_USER_SLAVE_PASSWORD || '',
        database: payload.DB_USER_SLAVE_DATABASE || 'default'
      }
    },
    redis: {
      host: payload.REDIS_HOST,
      port: +payload.REDIS_PORT,
      password: payload.REDIS_PASSWORD,
      timeout: +payload.REDIS_TIMEOUT
    }
  };
}
