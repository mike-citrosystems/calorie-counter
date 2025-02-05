type CalorieEntry = {
  id?: number;
  calories: number;
  description: string;
  timestamp: number;
  imageUrl?: string;
};

class CaloriesDB {
  private dbName = "calories-tracker";
  private version = 5;
  private storeName = "calories";
  private settingsStore = "settings";
  private imageStore = "images";

  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error("Database error:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        const db = request.result;
        console.log("Database opened successfully");
        console.log("Object stores:", Array.from(db.objectStoreNames));
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.log("Database upgrade needed");

        // Delete existing stores to ensure clean upgrade
        if (db.objectStoreNames.contains(this.imageStore)) {
          db.deleteObjectStore(this.imageStore);
        }

        // Create image store
        console.log("Creating image store");
        db.createObjectStore(this.imageStore, { keyPath: "id" });

        // Create other stores
        if (!db.objectStoreNames.contains(this.settingsStore)) {
          db.createObjectStore(this.settingsStore, { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("timestamp", "timestamp", { unique: false });
          store.createIndex("description", "description", { unique: false });
        }
      };
    });
  }

  async addCalories(
    calories: number,
    description: string,
    timestamp?: number,
    imageBlob?: Blob
  ): Promise<CalorieEntry> {
    const db = await this.init();
    let imageUrl: string | undefined;

    if (imageBlob) {
      console.log("Storing image blob:", imageBlob);
      const imageId = crypto.randomUUID();
      await this.storeImage(imageId, imageBlob);
      imageUrl = imageId;
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);

      const entry: CalorieEntry = {
        calories,
        description,
        timestamp: timestamp || Date.now(),
        imageUrl,
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

  async storeImage(id: string, blob: Blob): Promise<void> {
    console.log("Attempting to store image", id, blob);
    const db = await this.init();
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(this.imageStore, "readwrite");
        const store = transaction.objectStore(this.imageStore);

        const request = store.put({ id, blob });

        request.onsuccess = () => {
          console.log("Image stored successfully");
          resolve();
        };

        request.onerror = () => {
          console.error("Failed to store image:", request.error);
          reject(request.error);
        };

        transaction.oncomplete = () => {
          console.log("Transaction completed");
          db.close();
        };

        transaction.onerror = () => {
          console.error("Transaction error:", transaction.error);
        };
      } catch (error) {
        console.error("Error in storeImage:", error);
        reject(error);
      }
    });
  }

  async getImage(id: string): Promise<Blob | null> {
    const db = await this.init();
    return new Promise((resolve) => {
      const transaction = db.transaction(this.imageStore, "readonly");
      const store = transaction.objectStore(this.imageStore);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result?.blob || null);
      transaction.oncomplete = () => db.close();
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

  async getCalorieLimit(): Promise<number> {
    const db = await this.init();
    return new Promise((resolve) => {
      const transaction = db.transaction("settings", "readonly");
      const store = transaction.objectStore("settings");
      const request = store.get("calorieLimit");

      request.onsuccess = () => {
        resolve(request.result?.value || 3000); // Default to 3000 if not set
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  }

  async setCalorieLimit(limit: number): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("settings", "readwrite");
      const store = transaction.objectStore("settings");
      const request = store.put({ id: "calorieLimit", value: limit });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);

      transaction.oncomplete = () => {
        db.close();
      };
    });
  }
}

// Create a singleton instance
const db = new CaloriesDB();
export default db;
