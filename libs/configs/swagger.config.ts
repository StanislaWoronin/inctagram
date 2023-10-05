import { DocumentBuilder } from '@nestjs/swagger';
import { settings } from '../shared/settings';
import { SwaggerCustomOptions } from '@nestjs/swagger/dist/interfaces/swagger-custom-options.interface';

export const swaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('Inctagram-api')
    .setDescription('The Users API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
};

export const swaggerOptions = (url: string) => {
  const port = settings.port.MAIN_APP;
  return {
    explorer: true,
    // showExtensions: true,
    swaggerOptions: {
      urls: [
        {
          url: [`${url}/swagger-json`],
          name: 'Users API',
        },
        {
          url: `http://localhost:${port}/swagger`,
          name: 'Dew API',
        },
      ],
    },
  };
};
