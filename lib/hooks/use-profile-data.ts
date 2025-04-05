"use client";

import useSWR from "swr";
import { useState } from "react";
import { StartupProfileFormData, IndividualProfileFormData } from "@/lib/type";
import { fetcher } from "../fetcher";

export function useProfileData(profileType: "startup" | "individual" | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const endpoint = profileType ? `/api/profile/${profileType}` : null;

  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Cache for 1 minute
  });

  const formatStartupProfile = (rawData: any): StartupProfileFormData => {
    return {
      name: rawData?.name || "",
      description: rawData?.description || "",
      location: rawData?.location || "",
      industry: rawData?.industry || "",
      stage: rawData?.stage || "",
      teamSize: rawData?.teamSize ? rawData.teamSize.toString() : "",
      foundedYear: rawData?.foundedYear ? rawData.foundedYear.toString() : "",
      linkedin: rawData?.linkedin || "",
      website: rawData?.website || "",
      logo: rawData?.logo || null,
      banner: rawData?.banner || null,
    };
  };

  const formatIndividualProfile = (rawData: any): IndividualProfileFormData => {
    return {
      name: rawData?.name || "",
      email: rawData?.email || "",
      phone: rawData?.phone || "",
      location: rawData?.location || "",
      industry: rawData?.industry || "",
      role: rawData?.role || "",
      description: rawData?.description || "",
      linkedin: rawData?.linkedin || "",
      twitter: rawData?.twitter || "",
      github: rawData?.github || "",
      website: rawData?.website || "",
      profilePicture: rawData?.profilePicture || null,
      coverPicture: rawData?.coverPicture || null,
      cvPath: rawData?.cvPath || null,
    };
  };

  const updateProfile = async (formData: any) => {
    if (!profileType) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/profile/${profileType}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      await mutate();
      return true;
    } catch (error) {
      console.error(`Error updating ${profileType} profile:`, error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    profileData:
      profileType === "startup"
        ? data
          ? formatStartupProfile(data)
          : null
        : data
          ? formatIndividualProfile(data)
          : null,
    isLoading,
    error,
    isSubmitting,
    updateProfile,
    mutate,
  };
}
