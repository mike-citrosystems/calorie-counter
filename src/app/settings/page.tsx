"use client";

import { useState } from "react";
import db from "@/lib/db";

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);

  const handleBackup = async () => {
    try {
      setIsLoading(true);
      const data = await db.getAllEntries();
      const limit = await db.getCalorieLimit();

      // Get all images
      const entriesWithImages = await Promise.all(
        data.map(async (entry) => {
          if (entry.imageUrl) {
            const imageBlob = await db.getImage(entry.imageUrl);
            if (imageBlob) {
              // Convert blob to base64
              const buffer = await imageBlob.arrayBuffer();
              const base64 = btoa(
                new Uint8Array(buffer).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ""
                )
              );
              return { ...entry, imageData: base64 };
            }
          }
          return entry;
        })
      );

      const backup = {
        entries: entriesWithImages,
        settings: { calorieLimit: limit },
        version: 1,
      };

      const blob = new Blob([JSON.stringify(backup)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `calorie-tracker-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Backup failed:", error);
      alert("Failed to create backup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";

      input.onchange = async (e) => {
        setIsLoading(true);
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const text = await file.text();
        const backup = JSON.parse(text);

        if (backup.version !== 1) {
          throw new Error("Unsupported backup version");
        }

        await db.clearAllData();

        for (const entry of backup.entries) {
          const { imageData, ...entryData } = entry;
          let imageUrl = undefined;

          if (imageData) {
            try {
              // Convert base64 back to blob
              const binaryString = atob(imageData);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: "image/jpeg" });

              const imageId = crypto.randomUUID();
              await db.storeImage(imageId, blob);
              imageUrl = imageId;
            } catch (error) {
              console.error("Failed to restore image:", error);
            }
          }

          await db.addCalories(
            entryData.calories,
            entryData.description,
            entryData.timestamp,
            undefined,
            imageUrl
          );
        }

        await db.setCalorieLimit(backup.settings.calorieLimit);
        alert("Backup restored successfully");
        window.location.reload();
      };

      input.click();
    } catch (error) {
      console.error("Restore failed:", error);
      alert("Failed to restore backup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Settings</h1>
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <div>
          <h2 className="font-medium mb-2">Data Management</h2>
          <div className="space-y-3">
            <button
              onClick={handleBackup}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Backup Data"}
            </button>
            <button
              onClick={handleRestore}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Restore Data"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
