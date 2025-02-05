"use client";

import ProgressBar from "@/components/ProgressBar";
import AddCalories from "@/components/AddCalories";
import { useState, useEffect } from "react";
import db from "@/lib/db";

export default function Home() {
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    // Load today's calories when component mounts
    loadTodayCalories();
  }, []);

  const loadTodayCalories = async () => {
    try {
      const total = await db.getTodayCalories();
      setCalories(total);
    } catch (error) {
      console.error("Failed to load calories:", error);
    }
  };

  const handleAddCalories = async (amount: number, description: string) => {
    try {
      await db.addCalories(amount, description);
      await loadTodayCalories(); // Reload the total
    } catch (error) {
      console.error("Failed to add calories:", error);
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
      </div>
    </div>
  );
}
