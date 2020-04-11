import { Get, Param, Controller, Res } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { APP_CONFIG } from '../config';
import { ServerResponse } from 'http';

const { DATA_PATH, DATA_FOLDER } = APP_CONFIG;
const FALLBACK_FEEDS = join(__dirname, 'assets', 'banner.png');
const FALLBACK_SITES = join(__dirname, 'assets', 'icon.png');

@Controller('/static')
export class StaticController {
  @Get('/feeds/:id')
  getFeedBanner(@Param('id') id: string, @Res() response: ServerResponse) {
    response.setHeader('Content-Type', 'image/png');
    const path = join(DATA_PATH, DATA_FOLDER, 'feeds', id);

    if (existsSync(path)) {
      return createReadStream(path).pipe(response);
    }

    return createReadStream(FALLBACK_FEEDS).pipe(response);
  }

  @Get('/sites/:id')
  getSitesIcon(@Param('id') id: string, @Res() response: ServerResponse) {
    response.setHeader('Content-Type', 'image/png');
    const path = join(DATA_PATH, DATA_FOLDER, 'sites', id);

    if (existsSync(path)) {
      return createReadStream(path).pipe(response);
    }

    return createReadStream(FALLBACK_SITES).pipe(response);
  }
}
