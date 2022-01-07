interface ADB_ObjectStore {
  name: string;
  keyPath: string[];
  autoIncrement: boolean;
  indexes: {
    name: string;
    keyPath: string;
    multiEntry: boolean;
    unique: boolean;
  }[];
}

interface ADB_DatabaseSchema {
  version: number;
  objectStores: ADB_ObjectStore[];
}
