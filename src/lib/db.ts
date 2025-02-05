type CalorieEntry = {
  id?: number;
  calories: number;
  description: string;
  timestamp: number;
};

class CaloriesDB {
  private dbName = "calories-tracker";
  private version = 2;
  private storeName = "calories";

  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // If store exists, delete it to recreate with new schema
        if (db.objectStoreNames.contains(this.storeName)) {
          db.deleteObjectStore(this.storeName);
        }

        const store = db.createObjectStore(this.storeName, {
          keyPath: "id",
          autoIncrement: true,
        });
        // Create indexes for querying
        store.createIndex("timestamp", "timestamp", { unique: false });
        store.createIndex("description", "description", { unique: false });
      };
    });
  }

  async addCalories(
    calories: number,
    description: string,
    timestamp?: number
  ): Promise<CalorieEntry> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);

      const entry: CalorieEntry = {
        calories,
        description,
        timestamp: timestamp || Date.now(),
      };

      const request = store.add(entry);

      request.onsuccess = () => {
        entry.id = request.result as number;
        resolve(entry);
      };

      request.onerror = () => {
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  }

  async getTodayCalories(): Promise<number> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const index = store.index("timestamp");

      // Get start and end of today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const range = IDBKeyRange.bound(today.getTime(), tomorrow.getTime());
      const request = index.getAll(range);

      request.onsuccess = () => {
        const entries = request.result as CalorieEntry[];
        const total = entries.reduce((sum, entry) => sum + entry.calories, 0);
        resolve(total);
      };

      request.onerror = () => {
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  }

  async getAllEntries(): Promise<CalorieEntry[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  }

  async deleteEntry(id: number): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  }

  async clearAllData(): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  }
}

// Create a singleton instance
const db = new CaloriesDB();
export default db;
