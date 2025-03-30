export type StartupProfileType = {
  name: string;
  description: string | null;
  location: string | null;
  industry: string | null;
  stage: string | null;
  teamSize: number | null;
  foundedYear: number | null;
  linkedin: string | null;
  website: string | null;
  logo: string | null;
  banner: string | null;
};

export interface StartupProfileProps {
  profile: StartupProfileType;
}

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
