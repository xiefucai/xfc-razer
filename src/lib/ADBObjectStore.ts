/// <reference path="../../types/ADBObjectStore.d.ts" />
class ADBObjectTranstion {
  tx: IDBTransaction;
  table: string;
  constructor(db: IDBDatabase, table: string, mode?: IDBTransactionMode) {
    this.table = table;
    this.tx = db.transaction(table, mode);
  }

  add<T>(datas: T | T[]) {
    return new Promise((resolve, reject) => {
      const store = this.tx.objectStore(this.table);
      const requests: IDBRequest<IDBValidKey>[] = [];
      if (Array.isArray(datas)) {
        datas.forEach((data) => {
          requests.push(store.add(data));
        });
      } else {
        requests.push(store.add(datas));
      }

      this.tx.oncomplete = function () {
        if (Array.isArray(datas)) {
          resolve(requests.map((req) => req.result));
        } else {
          resolve(requests[0].result);
        }
      };

      this.tx.onerror = function () {
        if (this.error) {
          reject(this.error);
        }
      };
    });
  }
}

export class ADBObjectStore {
  db: IDBDatabase | null = null;
  db_name: string = '';

  constructor(DB_NAME: string) {
    this.db_name = DB_NAME;
  }

  open(database_schema: ADB_DatabaseSchema): Promise<IDBDatabase> {
    const self = this;
    return new Promise((resolve, reject) => {
      var request = window.indexedDB.open(
        this.db_name,
        database_schema.version,
      );

      request.onsuccess = function (event) {
        self.db = request.result;
        resolve(self.db);
      };

      request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
        var db = (event.target as IDBOpenDBRequest).result;

        db.onerror = function (event) {
          reject(event);
        };

        self.db = db;

        // Create an objectStore for this database

        database_schema.objectStores.forEach((table) => {
          var objectStore = db.createObjectStore(table.name, {
            keyPath: table.keyPath,
            autoIncrement: table.autoIncrement,
          });
          table.indexes.forEach(({ name, keyPath, multiEntry, unique }) => {
            objectStore.createIndex(name, keyPath, { unique, multiEntry });
          });
        });

        const tx = (event.target as IDBOpenDBRequest).transaction;

        if (tx) {
          tx.oncomplete = function () {
            // Now store is available to be populated
            resolve(db);
          };
        }
      };
    });
  }

  choose(table: string, mode?: IDBTransactionMode): ADBObjectTranstion {
    if (this.db) {
      return new ADBObjectTranstion(this.db, table, mode);
    }

    throw new Error('db is not opened');
  }
}
