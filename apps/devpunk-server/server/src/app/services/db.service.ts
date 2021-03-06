import { Injectable, Inject } from '@nestjs/common';
import { r, Connection, RTable, R, RSelection } from 'rethinkdb-ts';
import { APP_CONFIG } from '../config';
import { Logger } from './logger.service';
import { FeedEntry } from '@devpunk/models';

const { DB_HOST, DB_PASSWORD, DB_USERNAME, DB_PORT, DB_NAME } = APP_CONFIG;

interface ListOptions {
  sort?: string;
  offset?: number;
  range?: {
    max: string[];
    min: string[];
    key: string;
  };
  query?: string;
  limit?: number;
}

@Injectable()
export class DbService {
  static readonly SITES_TABLE = 'sites';
  static readonly FEEDS_TABLE = 'feeds';

  connection: Connection = null;

  constructor(@Inject('Logger') private readonly logger: Logger) {
    this.initDb();
  }

  async initDb() {
    try {
      const connection = await r.connect({
        host: DB_HOST,
        password: DB_PASSWORD,
        db: DB_NAME,
        user: DB_USERNAME,
        port: Number(DB_PORT)
      });
      this.connection = connection;

      const dbList = await r.dbList().run(this.connection);
      if (!dbList.includes(DB_NAME)) {
        await r.dbCreate(DB_NAME).run(this.connection);
      }

      connection.use(DB_NAME);

      const tableList = await r.tableList().run(this.connection);
      for (const tableName of [DbService.SITES_TABLE, DbService.FEEDS_TABLE]) {
        if (!tableList.includes(tableName)) {
          r.tableCreate(tableName, { primaryKey: 'id' }).run(connection);
        }
      }
    } catch (e) {
      this.logger.error('DB', e.message);
    }
  }

  addEntry(table: string, data: any) {
    return r
      .table(table)
      .insert(data)
      .run(this.connection);
  }

  listEntries<T>(table: string, options?: ListOptions): Promise<T[]> {
    let t: any = r.table<T>(table);

    if (options.range) {
      t = t.between(
        options.range.min.map(e => (e === 'MIN' ? r.minval : e)),
        options.range.max.map(e => (e === 'MAX' ? r.maxval : e)),
        {
          index: options.range.key,
          rightBound: 'closed'
        }
      );
    }

    if (options.sort) {
      t = t.orderBy({ index: r.desc(options.sort) });
    }

    if (options.query) {
      t = t.filter(
        r
          .row('title')
          .downcase()
          .match(options.query.toLowerCase())
      );
    }

    if (options.offset) {
      t = t.skip(options.offset);
    }

    if (options.limit) {
      t = t.limit(options.limit);
    }

    return t.run(this.connection);
  }

  getEntryFor(
    table: string,
    row: string,
    value: string,
    fromIndex: boolean = false
  ) {
    if (fromIndex) {
      return r
        .table(table)
        .getAll(value, { index: row })
        .run(this.connection);
    }
    return r
      .table(table)
      .filter(r.row(row).eq(value))
      .run(this.connection);
  }

  getEntryById<T>(table, id) {
    return r
      .table<T>(table)
      .get(id)
      .run(this.connection);
  }

  updateEntry<T>(table: string, id: string, data: T) {
    return r
      .table(table)
      .get(id)
      .replace({ ...data, id })
      .run(this.connection);
  }
}
