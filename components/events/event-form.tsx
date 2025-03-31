"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  ImageIcon,
  Calendar,
  MapPin,
  Clock,
  X,
  Info,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { TimePickerPopover } from "@/components/ui/time-picker-popover";
import { EventFormProps } from "@/lib/type";

export function EventForm({ defaultValues, onSuccess }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const isEditing = !!defaultValues?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [eventDate, setEventDate] = useState<Date | undefined>(
    defaultValues?.date ? new Date(defaultValues.date) : undefined
  );
  const [startDateTime, setStartDateTime] = useState<Date | undefined>(
    defaultValues?.startTime ? new Date(defaultValues.startTime) : undefined
  );
  const [endDateTime, setEndDateTime] = useState<Date | undefined>(
    defaultValues?.endTime ? new Date(defaultValues.endTime) : undefined
  );

  const [formData, setFormData] = useState({
    title: defaultValues?.title || "",
    description: defaultValues?.description || "",
    location: defaultValues?.location || "",
    eventImagePath: defaultValues?.eventImagePath || "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.eventImagePath || null
  );

  useEffect(() => {
    if (defaultValues?.eventImagePath) {
      setImagePreview(defaultValues.eventImagePath);
    }
  }, [defaultValues?.eventImagePath]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!eventDate) {
      newErrors.date = "Event date is required";
    }

    if (startDateTime && endDateTime) {
      if (endDateTime < startDateTime) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast("Image too large", {
        description: "Please upload an image smaller than 5MB",
      });
      return;
    }

    setIsUploading(true);

    try {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `event-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("events")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage.from("events").getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        eventImagePath: data.publicUrl,
      }));
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      eventImagePath: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        date: eventDate ? eventDate.toISOString() : "",
        startTime: startDateTime ? startDateTime.toISOString() : null,
        endTime: endDateTime ? endDateTime.toISOString() : null,
      };

      const url = isEditing ? `/api/events/${defaultValues.id}` : "/api/events";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save event");
      }

      toast.dismiss();
      toast.success(
        isEditing ? "Event updated successfully" : "Event created successfully"
      );

      if (onSuccess) {
        onSuccess();
      } else {
        if (isEditing && defaultValues.id) {
          router.push(`/events/${defaultValues.id}`);
        } else {
          router.push("/menu/events");
        }
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to save event", {
        description: "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-semibold">Event Cover Image</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Adding an eye-catching image will help your event stand out.
                    Recommended size: 1200x630px.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Card className="overflow-hidden border-dashed border-2 hover:border-primary/50 transition-colors">
            <div className="w-full h-80 relative rounded-lg overflow-hidden">
              {isUploading ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30">
                  <div className="relative">
                    <Loader2 className="h-10 w-10 text-primary animate-spin relative" />
                  </div>
                </div>
              ) : imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Event Cover"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-4 right-4 rounded-full h-9 w-9 shadow-md hover:shadow-lg transition-all"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/40 transition-colors">
                  <div className="p-4 rounded-full bg-muted-foreground/10 mb-3">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-2 font-medium">
                    Drag & drop an image or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Recommended: 1200x630px (max 5MB)
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 bg-background shadow-sm hover:shadow-md transition-all"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select Image
                  </Button>
                </div>
              )}
            </div>
          </Card>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="title"
              className={cn(
                "text-base font-medium flex items-center gap-1",
                errors.title && "text-destructive"
              )}
            >
              Event Title
              {errors.title && (
                <AlertCircle className="h-4 w-4 text-destructive ml-1" />
              )}
            </Label>
            <Input
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className={cn(
                "h-12 text-lg px-4",
                errors.title &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              placeholder="Enter a catchy title for your event"
            />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Event Details</h2>
            <Separator className="flex-1" />
          </div>

          <Card className="border shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="location"
                    className={cn(
                      "text-base font-medium flex items-center gap-1",
                      errors.location && "text-destructive"
                    )}
                  >
                    <MapPin className="h-4 w-4 text-primary mr-1" />
                    Location
                    {errors.location && (
                      <AlertCircle className="h-4 w-4 text-destructive ml-1" />
                    )}
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className={cn(
                      "h-11",
                      errors.location &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    placeholder="Address or virtual link (e.g., Zoom, Teams)"
                  />
                  {errors.location && (
                    <p className="text-destructive text-sm">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="date"
                    className={cn(
                      "text-base font-medium flex items-center gap-1",
                      errors.date && "text-destructive"
                    )}
                  >
                    <Calendar className="h-4 w-4 text-primary mr-1" />
                    Date
                    {errors.date && (
                      <AlertCircle className="h-4 w-4 text-destructive ml-1" />
                    )}
                  </Label>
                  <DateTimePicker
                    date={eventDate}
                    setDate={setEventDate}
                    includeTime={false}
                    placeholder="Select event date"
                    className={cn(
                      errors.date &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.date && (
                    <p className="text-destructive text-sm">{errors.date}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="startTime"
                    className="text-base font-medium flex items-center gap-1"
                  >
                    <Clock className="h-4 w-4 text-primary mr-1" />
                    Start Time
                  </Label>
                  <TimePickerPopover
                    date={startDateTime}
                    setDate={setStartDateTime}
                    placeholder="Select start time"
                  />
                  <p className="text-xs text-muted-foreground">
                    When will your event begin?
                  </p>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="endTime"
                    className={cn(
                      "text-base font-medium flex items-center gap-1",
                      errors.endTime && "text-destructive"
                    )}
                  >
                    <Clock className="h-4 w-4 text-primary mr-1" />
                    End Time
                    {errors.endTime && (
                      <AlertCircle className="h-4 w-4 text-destructive ml-1" />
                    )}
                  </Label>
                  <TimePickerPopover
                    date={endDateTime}
                    setDate={setEndDateTime}
                    className={cn(
                      errors.endTime &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    placeholder="Select end time"
                  />
                  {errors.endTime && (
                    <p className="text-destructive text-sm">{errors.endTime}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    When will your event conclude?
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="resize-none min-h-[120px] p-4"
                  placeholder="Provide details about your event, what attendees can expect, and why they should attend..."
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Include important details like agenda, speakers, what to
                  bring, and any prerequisites.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-10 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="min-w-[100px]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[140px]"
          isLoading={isSubmitting}
        >
          {isEditing ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
