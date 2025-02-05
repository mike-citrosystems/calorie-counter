"use client";

import ProgressBar from "@/components/ProgressBar";
import AddCalories from "@/components/AddCalories";
import { useState, useEffect } from "react";
import db from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import EntryList from "@/components/EntryList";
import { startOfDay, endOfDay } from "date-fns";
import {
  requestNotificationPermission,
  scheduleNotifications,
} from "@/lib/notifications";

type CalorieEntry = {
  id?: number;
  calories: number;
  description: string;
  timestamp: number;
};

export default function Home() {
  const [calories, setCalories] = useState(0);
  const [entries, setEntries] = useState<CalorieEntry[]>([]);
  const [isSeeded, setIsSeeded] = useState(false);

  useEffect(() => {
    const initNotifications = async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
        scheduleNotifications();
      }
    };

    initNotifications();
  }, []);

  useEffect(() => {
    const initData = async () => {
      if (process.env.NODE_ENV === "development" && !isSeeded) {
        await seedDatabase();
        setIsSeeded(true);
      }
      await loadTodayData();
    };

    initData();
  }, [isSeeded]);

  const loadTodayData = async () => {
    try {
      const allEntries = await db.getAllEntries();
      const today = new Date();
      const dayStart = startOfDay(today).getTime();
      const dayEnd = endOfDay(today).getTime();

      const todayEntries = allEntries.filter(
        (entry) => entry.timestamp >= dayStart && entry.timestamp <= dayEnd
      );

      setEntries(todayEntries.sort((a, b) => a.timestamp - b.timestamp));
      setCalories(todayEntries.reduce((sum, entry) => sum + entry.calories, 0));
    } catch (error) {
      console.error("Failed to load today's data:", error);
    }
  };

  const handleAddCalories = async (amount: number, description: string) => {
    try {
      await db.addCalories(amount, description);
      await loadTodayData();
    } catch (error) {
      console.error("Failed to add calories:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await db.deleteEntry(id);
      await loadTodayData();
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Today&apos;s Calories</h2>
            <AddCalories onAdd={handleAddCalories} />
          </div>
          <ProgressBar limit={3000} currentValue={calories} color="green" />
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <EntryList
            entries={entries}
            onDelete={handleDelete}
            showDate={false}
          />
        </div>
      </div>
    </div>
  );
}
