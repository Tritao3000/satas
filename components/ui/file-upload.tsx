"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Card } from "./card";
import Image from "next/image";
import { Upload, X, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  accept?: string;
  onChange: (file: File | null) => void;
  previewUrl?: string | null;
  className?: string;
  previewClassName?: string;
  isCV?: boolean;
}

export function FileUpload({
  label,
  accept = "image/*",
  onChange,
  previewUrl,
  className,
  previewClassName,
  isCV = false,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Set initial preview based on previewUrl
  useEffect(() => {
    if (previewUrl) {
      if (
        isCV &&
        (previewUrl.endsWith(".pdf") ||
          previewUrl.endsWith(".doc") ||
          previewUrl.endsWith(".docx"))
      ) {
        setPreview("existing-cv-file");
      } else if (!isCV) {
        setPreview(previewUrl);
      }
    } else {
      setPreview(null);
    }
  }, [previewUrl, isCV]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleFile = (file: File | null) => {
    if (file) {
      onChange(file);

      if (!isCV && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (isCV) {
        setPreview("new-cv-file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFile(file);
  };

  const removeFile = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium">{label}</p>

      {!preview ? (
        <Card
          className={cn(
            "flex flex-col items-center justify-center border-dashed p-4 transition-colors",
            isDragging ? "border-primary" : "border-border",
            className
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="mb-1 text-sm font-medium">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              {isCV
                ? "Upload your CV (PDF, DOC, DOCX)"
                : "PNG, JPG or GIF, max 10MB"}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
            >
              Select File
            </Button>
          </div>
        </Card>
      ) : (
        <div className="relative">
          {isCV &&
          (preview === "new-cv-file" || preview === "existing-cv-file") ? (
            <div
              className={cn(
                "flex items-center justify-between border rounded-md p-3",
                previewClassName
              )}
            >
              <div className="flex flex-col">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 mr-2 text-primary" />
                  <div className="flex flex-col ">
                    <span className="text-sm">
                      CV File{" "}
                      {preview === "new-cv-file" ? "Selected" : "Uploaded"}
                    </span>
                    {preview === "existing-cv-file" && previewUrl && (
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "relative overflow-hidden rounded-md",
                previewClassName
              )}
            >
              <Image
                src={preview}
                alt="Preview"
                className="object-cover w-full h-full"
                width={300}
                height={300}
              />
            </div>
          )}
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-5 w-5 rounded-full"
            onClick={removeFile}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
