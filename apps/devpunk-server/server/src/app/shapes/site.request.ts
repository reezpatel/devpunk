import { SitesEntry } from '@devpunk/models';
import {
  IsNumber,
  IsString,
  IsIn,
  IsUrl,
  IsOptional,
  IsBoolean
} from 'class-validator';

export class SiteRequest implements SitesEntry {
  @IsIn([undefined])
  id: string;

  @IsString()
  name: string;

  @IsIn(['RSS', 'ALGOLIA'])
  type: 'RSS' | 'ALGOLIA';

  @IsUrl()
  website: string;

  @IsUrl()
  feed: string;

  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false
  })
  order: number;

  @IsBoolean()
  active: boolean;
}
