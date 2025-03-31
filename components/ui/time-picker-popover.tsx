"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerPopoverProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function TimePickerPopover({
  date,
  setDate,
  className,
  placeholder = "Select time",
  disabled = false,
}: TimePickerPopoverProps) {
  const [selectedTime, setSelectedTime] = React.useState<Date | undefined>(
    date
  );

  const minuteRef = React.useRef<HTMLButtonElement>(null);
  const hourRef = React.useRef<HTMLButtonElement>(null);

  const [hour, setHour] = React.useState<number>(
    selectedTime ? selectedTime.getHours() % 12 || 12 : 12
  );
  const [minute, setMinute] = React.useState<number>(
    selectedTime ? selectedTime.getMinutes() : 0
  );
  const [meridiem, setMeridiem] = React.useState<"AM" | "PM">(
    selectedTime ? (selectedTime.getHours() >= 12 ? "PM" : "AM") : "AM"
  );

  React.useEffect(() => {
    if (selectedTime) {
      setDate(selectedTime);
    }
  }, [selectedTime, setDate]);

  React.useEffect(() => {
    if (date !== selectedTime) {
      setSelectedTime(date);

      if (date) {
        const hours = date.getHours();
        const displayHour = hours % 12 === 0 ? 12 : hours % 12;
        setHour(displayHour);
        setMinute(date.getMinutes());
        setMeridiem(hours >= 12 ? "PM" : "AM");
      }
    }
  }, [date]);

  React.useEffect(() => {
    if (!selectedTime) {
      const now = new Date();
      setSelectedTime(now);
      return;
    }

    const newDate = new Date(selectedTime);

    let formattedHour = hour;
    if (meridiem === "PM" && hour < 12) formattedHour += 12;
    if (meridiem === "AM" && hour === 12) formattedHour = 0;

    newDate.setHours(formattedHour, minute);
    setSelectedTime(newDate);
  }, [hour, minute, meridiem]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-11",
            !selectedTime && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedTime ? (
            format(selectedTime, "h:mm a")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex items-center gap-2">
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
      </PopoverContent>
    </Popover>
  );
}
