"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export function TimePicker({ date, setDate, className }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLButtonElement>(null);
  const hourRef = React.useRef<HTMLButtonElement>(null);

  const [hour, setHour] = React.useState<number>(date ? date.getHours() : 12);
  const [minute, setMinute] = React.useState<number>(
    date ? date.getMinutes() : 0
  );
  const [meridiem, setMeridiem] = React.useState<"AM" | "PM">(
    date ? (date.getHours() >= 12 ? "PM" : "AM") : "AM"
  );

  const buildTimeString = (
    hour: number,
    minute: number,
    meridiem: "AM" | "PM"
  ) => {
    let h = hour;
    if (meridiem === "PM" && hour < 12) h += 12;
    if (meridiem === "AM" && hour === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  };

  React.useEffect(() => {
    if (!date) return;

    const hours = date.getHours();
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    setHour(displayHour);
    setMinute(date.getMinutes());
    setMeridiem(hours >= 12 ? "PM" : "AM");
  }, [date]);

  React.useEffect(() => {
    const newDate = new Date(date || new Date());

    let formattedHour = hour;
    if (meridiem === "PM" && hour < 12) formattedHour += 12;
    if (meridiem === "AM" && hour === 12) formattedHour = 0;

    newDate.setHours(formattedHour, minute);
    setDate(newDate);
  }, [hour, minute, meridiem, setDate]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Clock className="h-4 w-4 text-muted-foreground" />

      <div className="flex items-center gap-1">
        <Select
          value={hour.toString()}
          onValueChange={(value) => setHour(parseInt(value))}
        >
          <SelectTrigger ref={hourRef} className="w-[70px]">
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((h) => (
              <SelectItem key={h} value={h.toString()}>
                {h.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-muted-foreground">:</span>

        <Select
          value={minute.toString()}
          onValueChange={(value) => setMinute(parseInt(value))}
        >
          <SelectTrigger ref={minuteRef} className="w-[70px]">
            <SelectValue placeholder="Minute" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((m) => (
              <SelectItem key={m} value={m.toString()}>
                {m.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={meridiem}
          onValueChange={(value) => setMeridiem(value as "AM" | "PM")}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
