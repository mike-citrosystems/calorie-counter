"use client";

import { useState, useEffect } from "react";
import Calendar from "@/components/Calendar";
import db from "@/lib/db";
import { format } from "date-fns";
import EntryList from "@/components/EntryList";

type CalorieEntry = {
  id?: number;
  calories: number;
  description: string;
  timestamp: number;
};

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<CalorieEntry[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    loadEntriesForDate(selectedDate);
  }, [selectedDate]);

  const loadEntriesForDate = async (date: Date) => {
    try {
      const allEntries = await db.getAllEntries();
      const dayStart = new Date(date).setHours(0, 0, 0, 0);
      const dayEnd = new Date(date).setHours(23, 59, 59, 999);

      const dayEntries = allEntries.filter(
        (entry) => entry.timestamp >= dayStart && entry.timestamp <= dayEnd
      );

      setEntries(dayEntries.sort((a, b) => a.timestamp - b.timestamp));
      setTotalCalories(
        dayEntries.reduce((sum, entry) => sum + entry.calories, 0)
      );
    } catch (error) {
      console.error("Failed to load entries:", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Calendar onSelectDate={setSelectedDate} selectedDate={selectedDate} />

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          <span className="text-lg font-semibold text-blue-500">
            {totalCalories} cal
          </span>
        </div>

        <EntryList entries={entries} showDate={false} />
      </div>
    </div>
  );
}
