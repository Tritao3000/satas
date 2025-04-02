"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  Building2,
  MapPin,
  DollarSign,
  BriefcaseBusiness,
  Info,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type JobFormProps = {
  defaultValues?: {
    id?: string;
    title?: string;
    description?: string;
    location?: string;
    type?: string;
    salary?: number | null;
  };
  onSuccess?: () => void;
};

export function JobForm({ defaultValues, onSuccess }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!defaultValues?.id;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: defaultValues?.title || "",
    description: defaultValues?.description || "",
    location: defaultValues?.location || "",
    type: defaultValues?.type || "Full-time",
    salary: defaultValues?.salary || "",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.type) {
      newErrors.type = "Job type is required";
    }

    if (
      formData.salary !== "" &&
      (isNaN(Number(formData.salary)) || Number(formData.salary) < 0)
    ) {
      newErrors.salary = "Salary must be a positive number";
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

  const handleSelectChange = (value: string) => {
    if (errors.type) {
      setErrors({
        ...errors,
        type: "",
      });
    }

    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
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
        salary: formData.salary ? parseInt(formData.salary.toString()) : null,
      };

      const url = isEditing ? `/api/jobs/${defaultValues.id}` : "/api/jobs";
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
        throw new Error(errorData.error || "Failed to save job");
      }

      toast.success(
        isEditing ? "Job updated successfully" : "Job created successfully"
      );

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/menu/jobs");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error saving job:", error);
      toast.error(error.message || "Failed to save job", {
        description: "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-8">
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
              <BriefcaseBusiness className="h-4 w-4 text-primary mr-1" />
              Job Title
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
              placeholder="Enter a descriptive title for this position"
            />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Job Details</h2>
            <Separator className="flex-1" />
          </div>

          <Card className="border shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="type"
                    className={cn(
                      "text-base font-medium flex items-center gap-1",
                      errors.type && "text-destructive"
                    )}
                  >
                    <Building2 className="h-4 w-4 text-primary mr-1" />
                    Job Type
                    {errors.type && (
                      <AlertCircle className="h-4 w-4 text-destructive ml-1" />
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Select the employment type for this position.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={handleSelectChange}
                    required
                  >
                    <SelectTrigger
                      className={cn(
                        "h-11 text-base",
                        errors.type &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    >
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-destructive text-sm">{errors.type}</p>
                  )}
                </div>

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
                    placeholder="Office location or 'Remote'"
                  />
                  {errors.location && (
                    <p className="text-destructive text-sm">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="salary"
                    className={cn(
                      "text-base font-medium flex items-center gap-1",
                      errors.salary && "text-destructive"
                    )}
                  >
                    <DollarSign className="h-4 w-4 text-primary mr-1" />
                    Salary (Optional)
                    {errors.salary && (
                      <AlertCircle className="h-4 w-4 text-destructive ml-1" />
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Providing a clear salary range can increase the
                            quality of applicants.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleChange}
                    className={cn(
                      "h-11",
                      errors.salary &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    placeholder="Annual salary in USD"
                  />
                  {errors.salary && (
                    <p className="text-destructive text-sm">{errors.salary}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter the annual salary in USD without commas or symbols.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="description"
                  className="text-base font-medium flex items-center gap-1"
                >
                  Description
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Include key responsibilities, requirements, benefits,
                          and application instructions.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={8}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="resize-none min-h-[200px] p-4"
                  placeholder="Describe the job responsibilities, requirements, benefits, and application process..."
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Include required skills, experience level, education
                  requirements, and any benefits such as healthcare, remote work
                  options, or flexible hours.
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
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update Job" : "Create Job"}
        </Button>
      </div>
    </form>
  );
}
