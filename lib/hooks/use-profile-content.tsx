"use client";

import React, { createContext, useContext } from "react";
import useSWR from "swr";
import { ProfileContextType, ProfileData } from "@/lib/type";
import { fetcher } from "@/lib/fetcher";

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
  const { data, error, isLoading, mutate } = useSWR<ProfileData>(
    "/api/user/me",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 3600000,
    }
  );

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
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}

export function useUserName() {
  const { userType, userId, email } = useProfile();

  const { data: profileData, isLoading } = useSWR(
    userId && userType ? `/api/profile/${userType}/get` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const defaultName = email ? email.split("@")[0] : "User";

  if (isLoading || !profileData) {
    return { name: defaultName, isLoading: true };
  }

  let name = defaultName;

  if (userType === "individual" && profileData.name) {
    name = profileData.name;
  } else if (userType === "startup" && profileData.name) {
    name = profileData.name;
  }

  return { name, isLoading: false };
}
