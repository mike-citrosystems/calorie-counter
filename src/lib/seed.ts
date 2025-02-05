import db from "./db";
import { subDays } from "date-fns";

// Common meals that will be rotated
const meals = {
  breakfast: [
    { description: "Oatmeal with Berries", calories: 290 },
    { description: "Avocado Toast", calories: 350 },
    { description: "Greek Yogurt with Granola", calories: 280 },
    { description: "Breakfast Burrito", calories: 450 },
    { description: "Smoothie Bowl", calories: 320 },
  ],
  snacks: [
    { description: "Apple with Peanut Butter", calories: 200 },
    { description: "Trail Mix", calories: 210 },
    { description: "Protein Bar", calories: 180 },
    { description: "Banana", calories: 105 },
    { description: "Handful of Almonds", calories: 160 },
  ],
  lunch: [
    { description: "Chicken Salad", calories: 450 },
    { description: "Turkey Sandwich", calories: 380 },
    { description: "Quinoa Bowl", calories: 420 },
    { description: "Tuna Wrap", calories: 350 },
    { description: "Buddha Bowl", calories: 480 },
  ],
  dinner: [
    { description: "Grilled Salmon", calories: 460 },
    { description: "Chicken Stir Fry", calories: 520 },
    { description: "Pasta with Meatballs", calories: 650 },
    { description: "Vegetable Curry", calories: 380 },
    { description: "Fish Tacos", calories: 450 },
  ],
  drinks: [
    { description: "Morning Coffee", calories: 120 },
    { description: "Green Tea", calories: 5 },
    { description: "Protein Shake", calories: 180 },
    { description: "Smoothie", calories: 220 },
    { description: "Sparkling Water", calories: 0 },
  ],
};

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateDayEntries(date: Date) {
  const entries = [];

  // Morning Coffee (80% chance)
  if (Math.random() < 0.8) {
    entries.push({
      ...getRandomItem(meals.drinks),
      timestamp: new Date(date).setHours(8, 30, 0, 0),
    });
  }

  // Breakfast (90% chance)
  if (Math.random() < 0.9) {
    entries.push({
      ...getRandomItem(meals.breakfast),
      timestamp: new Date(date).setHours(9, 0, 0, 0),
    });
  }

  // Morning Snack (60% chance)
  if (Math.random() < 0.6) {
    entries.push({
      ...getRandomItem(meals.snacks),
      timestamp: new Date(date).setHours(11, 0, 0, 0),
    });
  }

  // Lunch (95% chance)
  if (Math.random() < 0.95) {
    entries.push({
      ...getRandomItem(meals.lunch),
      timestamp: new Date(date).setHours(13, 0, 0, 0),
    });
  }

  // Afternoon Snack (70% chance)
  if (Math.random() < 0.7) {
    entries.push({
      ...getRandomItem(meals.snacks),
      timestamp: new Date(date).setHours(15, 30, 0, 0),
    });
  }

  // Afternoon Drink (40% chance)
  if (Math.random() < 0.4) {
    entries.push({
      ...getRandomItem(meals.drinks),
      timestamp: new Date(date).setHours(16, 0, 0, 0),
    });
  }

  // Dinner (98% chance)
  if (Math.random() < 0.98) {
    entries.push({
      ...getRandomItem(meals.dinner),
      timestamp: new Date(date).setHours(19, 0, 0, 0),
    });
  }

  // Evening Snack (30% chance)
  if (Math.random() < 0.3) {
    entries.push({
      ...getRandomItem(meals.snacks),
      timestamp: new Date(date).setHours(21, 0, 0, 0),
    });
  }

  return entries;
}

export async function seedDatabase() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  try {
    // Clear existing data
    await db.clearAllData();

    // Generate entries for the past 14 days
    const twoWeeksEntries = Array.from({ length: 14 }, (_, i) => {
      const date = subDays(new Date(), i);
      return generateDayEntries(date);
    }).flat();

    // Add all entries
    for (const entry of twoWeeksEntries) {
      await db.addCalories(entry.calories, entry.description);
    }

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}
