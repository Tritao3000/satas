"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

type EventFormProps = {
  defaultValues?: {
    id?: string;
    title?: string;
    description?: string | null;
    location?: string;
    date?: string;
    startTime?: string | null;
    endTime?: string | null;
    eventImagePath?: string | null;
  };
  onSuccess?: () => void;
};

export function EventForm({ defaultValues, onSuccess }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const isEditing = !!defaultValues?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: defaultValues?.title || "",
    description: defaultValues?.description || "",
    location: defaultValues?.location || "",
    date: defaultValues?.date
      ? new Date(defaultValues.date).toISOString().split("T")[0]
      : "",
    startTime: defaultValues?.startTime
      ? new Date(defaultValues.startTime).toISOString().slice(0, 16)
      : "",
    endTime: defaultValues?.endTime
      ? new Date(defaultValues.endTime).toISOString().slice(0, 16)
      : "",
    eventImagePath: defaultValues?.eventImagePath || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast("Image too large", {
        description: "Please upload an image smaller than 5MB",
      });
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `event-images/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("events")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get the public URL
      const { data } = supabase.storage.from("events").getPublicUrl(filePath);

      // Update the form data with the image path
      setFormData((prev) => ({
        ...prev,
        eventImagePath: data.publicUrl,
      }));

      toast("Image uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast("Failed to upload image", {
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate the form data
      if (!formData.title || !formData.location || !formData.date) {
        throw new Error("Please fill in all required fields");
      }

      // Prepare dates for API
      const dateObj = new Date(formData.date);
      const startTimeObj = formData.startTime
        ? new Date(formData.startTime)
        : null;
      const endTimeObj = formData.endTime ? new Date(formData.endTime) : null;

      // Prepare data for submission
      const submitData = {
        ...formData,
        date: dateObj.toISOString(),
        startTime: startTimeObj ? startTimeObj.toISOString() : null,
        endTime: endTimeObj ? endTimeObj.toISOString() : null,
      };

      // Determine if we're creating or updating
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

      // Show success toast
      toast(
        isEditing ? "Event updated successfully" : "Event created successfully"
      );

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to events listing
        router.push("/menu/events");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast(error.message || "Failed to save event", {
        description: "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Event" : "Create Event"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title*</Label>
            <Input
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location*</Label>
            <Input
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="Address or virtual link"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date*</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about the event"
            />
          </div>

          <div className="space-y-2">
            <Label>Event Image</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {isUploading ? "Uploading..." : "Upload Image"}
              </Button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <span className="text-sm text-muted-foreground">
                Recommended size: 1200 x 630 pixels (max 5MB)
              </span>
            </div>

            {formData.eventImagePath && (
              <div className="mt-4">
                <div className="relative h-40 w-full md:w-1/2 overflow-hidden rounded-md">
                  <Image
                    src={formData.eventImagePath}
                    alt="Event preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Event" : "Create Event"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
