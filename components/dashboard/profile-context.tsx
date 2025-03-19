"use client";

import React, { createContext, useContext } from "react";
import useSWR from "swr";

export interface ProfileData {
  id: string;
  email: string | null;
  userType: string | null;
  hasProfile: boolean;
}

export interface ProfileContextType {
  isProfileSetup: boolean;
  isLoading: boolean;
  userType: string | null;
  email: string | null;
  userId: string | null;
  data: ProfileData | null;
  refreshProfileStatus: () => void;
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch profile data");
  }
  return response.json();
};

const ProfileContext = createContext<ProfileContextType>({
  isProfileSetup: false,
  isLoading: true,
  userType: null,
  email: null,
  userId: null,
  data: null,
  refreshProfileStatus: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const {
    data,
    error,
    isLoading,
    mutate
  } = useSWR<ProfileData>("/api/user/me", fetcher, {
    revalidateOnFocus: false, // Don't revalidate on window focus
    revalidateOnReconnect: false, // Don't revalidate on reconnect
    refreshInterval: 0, // Don't automatically refresh
    dedupingInterval: 3600000, // Dedupe requests within 1 hour (3600000 ms)
  });

  const value = {
    isProfileSetup: Boolean(data?.userType && data?.hasProfile),
    isLoading,
    userType: data?.userType || null,
    email: data?.email || null,
    userId: data?.id || null,
    data: data || null,
    refreshProfileStatus: () => mutate(),
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
