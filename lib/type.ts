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

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

export interface BreadcrumbContextType {
  items: BreadcrumbItem[];
  isLoading: boolean;
}

export interface Job {
  id: string;
  startupId: string;
  title: string;
  description: string;
  location: string;
  type: string;
  salary: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  eventImagePath?: string | null;
  createdAt: string;
  updatedAt: string;
  startup?: {
    id: string;
    name: string;
    logo?: string;
  };
}
