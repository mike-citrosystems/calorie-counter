"use client";

import { useState, useMemo } from "react";
import menuItems from "@/lib/menu.json";
import { IoSearch, IoRestaurantOutline } from "react-icons/io5";
import Image from "next/image";

export default function PlannerPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const groupedAndFilteredItems = useMemo(() => {
    const filteredItems = menuItems.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filteredItems.reduce((groups, item) => {
      const category = item.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {} as Record<string, typeof menuItems>);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white shadow-sm z-20">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center gap-4 mb-4">
            <IoRestaurantOutline className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Meal Library</h1>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-0 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
            />
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 divide-y divide-gray-200">
        {Object.entries(groupedAndFilteredItems).map(([category, items]) => (
          <div key={category} className="py-6 space-y-4">
            <div className="sticky top-[132px] bg-gray-50 z-10 py-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {category}
                </h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
              </div>
              <div className="text-sm text-gray-500">
                {items.length} {items.length === 1 ? "item" : "items"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 pt-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md overflow-hidden transition-all duration-200 cursor-pointer"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {item.src ? (
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <IoRestaurantOutline className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                      {item.label}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedAndFilteredItems).length === 0 && (
          <div className="text-center py-12">
            <IoRestaurantOutline className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              No meals found matching your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
