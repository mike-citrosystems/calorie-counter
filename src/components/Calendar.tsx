"use client";

import { useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  endOfWeek,
} from "date-fns";

interface CalendarProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

export default function Calendar({
  onSelectDate,
  selectedDate,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "MMMM yyyy";
  const rows = [];
  let day = startDate;

  // Calendar header with days
  const daysHeader = ["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
    <div key={idx} className="font-semibold text-center p-1 text-sm">
      {d}
    </div>
  ));

  // Calendar cells
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      days.push(
        <button
          key={day.toString()}
          onClick={() => onSelectDate(cloneDay)}
          className={`
            relative w-full pt-[100%] border border-gray-100
            ${!isSameMonth(day, monthStart) ? "text-gray-300" : ""}
            ${
              isSameDay(day, selectedDate)
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-50"
            }
            ${isToday(day) ? "font-bold" : ""}
          `}
        >
          <span className="absolute top-1 right-1 text-sm">
            {format(day, "d")}
          </span>
        </button>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-px">
        {days}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="font-semibold">{format(currentMonth, dateFormat)}</h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px mb-2">{daysHeader}</div>
      <div className="space-y-px">{rows}</div>
    </div>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}
