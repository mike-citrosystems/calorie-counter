import db from "./db";
import { subDays } from "date-fns";

// Common meals that will be rotated
const meals = {
  breakfast: [
    {
      description: "Oatmeal with Berries",
      calories: 290,
      category: "Breakfast",
    },
    { description: "Avocado Toast", calories: 350, category: "Breakfast" },
    {
      description: "Greek Yogurt with Granola",
      calories: 280,
      category: "Breakfast",
    },
    { description: "Breakfast Burrito", calories: 450, category: "Breakfast" },
    { description: "Smoothie Bowl", calories: 320, category: "Breakfast" },
  ],
  snacks: [
    {
      description: "Apple with Peanut Butter",
      calories: 200,
      category: "Snack",
    },
    { description: "Trail Mix", calories: 210, category: "Snack" },
    { description: "Protein Bar", calories: 180, category: "Snack" },
    { description: "Banana", calories: 105, category: "Snack" },
    { description: "Handful of Almonds", calories: 160, category: "Snack" },
  ],
  lunch: [
    { description: "Chicken Salad", calories: 450, category: "Lunch" },
    { description: "Turkey Sandwich", calories: 380, category: "Lunch" },
    { description: "Quinoa Bowl", calories: 420, category: "Lunch" },
    { description: "Tuna Wrap", calories: 350, category: "Lunch" },
    { description: "Buddha Bowl", calories: 480, category: "Lunch" },
  ],
  dinner: [
    { description: "Grilled Salmon", calories: 460, category: "Dinner" },
    { description: "Chicken Stir Fry", calories: 520, category: "Dinner" },
    { description: "Pasta with Meatballs", calories: 650, category: "Dinner" },
    { description: "Vegetable Curry", calories: 380, category: "Dinner" },
    { description: "Fish Tacos", calories: 450, category: "Dinner" },
  ],
  drinks: [
    { description: "Morning Coffee", calories: 120, category: "Snack" },
    { description: "Green Tea", calories: 5, category: "Snack" },
    { description: "Protein Shake", calories: 180, category: "Snack" },
    { description: "Smoothie", calories: 220, category: "Snack" },
    { description: "Sparkling Water", calories: 0, category: "Snack" },
  ],
};

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateDayEntries(date: Date) {
  const entries = [];

  // Morning Coffee (80% chance)
  if (Math.random() < 0.8) {
    const meal = getRandomItem(meals.drinks);
    entries.push({
      ...meal,
      description: `[${meal.category}] ${meal.description}`,
      timestamp: new Date(date).setHours(8, 30, 0, 0),
    });
  }

  // Breakfast (90% chance)
  if (Math.random() < 0.9) {
    const meal = getRandomItem(meals.breakfast);
    entries.push({
      ...meal,
      description: `[${meal.category}] ${meal.description}`,
      timestamp: new Date(date).setHours(9, 0, 0, 0),
    });
  }

  // Morning Snack (60% chance)
  if (Math.random() < 0.6) {
    const meal = getRandomItem(meals.snacks);
    entries.push({
      ...meal,
      description: `[${meal.category}] ${meal.description}`,
      timestamp: new Date(date).setHours(11, 0, 0, 0),
    });
  }

  // Lunch (95% chance)
  if (Math.random() < 0.95) {
    const meal = getRandomItem(meals.lunch);
    entries.push({
      ...meal,
      description: `[${meal.category}] ${meal.description}`,
      timestamp: new Date(date).setHours(13, 0, 0, 0),
    });
  }

  // Afternoon Snack (70% chance)
  if (Math.random() < 0.7) {
    const meal = getRandomItem(meals.snacks);
    entries.push({
      ...meal,
      description: `[${meal.category}] ${meal.description}`,
      timestamp: new Date(date).setHours(15, 30, 0, 0),
    });
  }

  // Afternoon Drink (40% chance)
  if (Math.random() < 0.4) {
    const meal = getRandomItem(meals.drinks);
    entries.push({
      ...meal,
      description: `[${meal.category}] ${meal.description}`,
      timestamp: new Date(date).setHours(16, 0, 0, 0),
    });
  }

  // Dinner (98% chance)
  if (Math.random() < 0.98) {
    const meal = getRandomItem(meals.dinner);
    entries.push({
      ...meal,
      description: `[${meal.category}] ${meal.description}`,
      timestamp: new Date(date).setHours(19, 0, 0, 0),
    });
  }

  // Evening Snack (30% chance)
  if (Math.random() < 0.3) {
    const meal = getRandomItem(meals.snacks);
    entries.push({
      ...meal,
      description: `[${meal.category}] ${meal.description}`,
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

    // Add all entries with their timestamps
    for (const entry of twoWeeksEntries) {
      await db.addCalories(entry.calories, entry.description, entry.timestamp);
    }

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}
