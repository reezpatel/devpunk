import { Injectable, Inject } from '@nestjs/common';
import { r, Connection } from 'rethinkdb-ts';
import { APP_CONFIG } from '../config';
import { Logger } from './logger.service';

const { DB_HOST, DB_PASSWORD, DB_USERNAME, DB_PORT, DB_NAME } = APP_CONFIG;

interface ListOptions {
  sort?: string;
  offset?: number;
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
    return r
      .table<T>(table)
      .orderBy(r.asc(options?.sort ?? 'id'))
      .skip(options?.offset ?? 0)
      .limit(options?.limit ?? 10)
      .run(this.connection);
  }

  getEntryFor(table: string, row: string, value: string) {
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
