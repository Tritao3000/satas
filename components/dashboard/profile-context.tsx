"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

interface ProfileContextType {
  isProfileSetup: boolean;
  isLoading: boolean;
  userType: string | null;
  email: string | null;
  refreshProfileStatus: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  isProfileSetup: false,
  isLoading: true,
  userType: null,
  email: null,
  refreshProfileStatus: async () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [isProfileSetup, setIsProfileSetup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const checkProfileStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/user/me", {
        cache: "no-store",
        headers: {
          pragma: "no-cache",
          "cache-control": "no-cache",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const hasSetup = Boolean(data.userType && data.hasProfile);
        setIsProfileSetup(hasSetup);
        setUserType(data.userType);
        setEmail(data.email || null);
        return hasSetup;
      }
      return false;
    } catch (error) {
      console.error("Error checking profile status:", error);
      return false;
    }
  }, []);

  const refreshProfileStatus = useCallback(async () => {
    setIsLoading(true);
    await checkProfileStatus();
    setIsLoading(false);
  }, [checkProfileStatus]);

  useEffect(() => {
    refreshProfileStatus();
  }, [refreshProfileStatus]);

  return (
    <ProfileContext.Provider
      value={{
        isProfileSetup,
        isLoading,
        userType,
        email,
        refreshProfileStatus,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
