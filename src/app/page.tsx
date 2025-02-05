"use client";

import ProgressBar from "@/components/ProgressBar";
import AddCalories from "@/components/AddCalories";
import { useState, useEffect } from "react";
import db from "@/lib/db";
import { formatDistanceToNow } from "date-fns";

type CalorieEntry = {
  id?: number;
  calories: number;
  description: string;
  timestamp: number;
};

export default function Home() {
  const [calories, setCalories] = useState(0);
  const [entries, setEntries] = useState<CalorieEntry[]>([]);

  useEffect(() => {
    // Load today's calories when component mounts
    loadTodayCalories();
    loadEntries();
  }, []);

  const loadTodayCalories = async () => {
    try {
      const total = await db.getTodayCalories();
      setCalories(total);
    } catch (error) {
      console.error("Failed to load calories:", error);
    }
  };

  const loadEntries = async () => {
    try {
      const allEntries = await db.getAllEntries();
      // Sort entries by timestamp, newest first
      setEntries(allEntries.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error("Failed to load entries:", error);
    }
  };

  const handleAddCalories = async (amount: number, description: string) => {
    try {
      await db.addCalories(amount, description);
      await loadTodayCalories();
      await loadEntries();
    } catch (error) {
      console.error("Failed to add calories:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await db.deleteEntry(id);
      await loadTodayCalories();
      await loadEntries();
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

        <div className="bg-white rounded-lg shadow-md divide-y divide-gray-100">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">
                    {entry.calories} cal
                  </span>
                  <h3 className="text-sm text-gray-900 truncate">
                    {entry.description}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                </p>
              </div>
              <button
                onClick={() => entry.id && handleDelete(entry.id)}
                className="ml-4 text-gray-400 hover:text-red-500 transition-colors duration-150"
                aria-label="Delete entry"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>No entries yet. Add your first meal!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
