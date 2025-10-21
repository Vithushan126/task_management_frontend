export enum OrganizationPlan {
  FREE = 'free',
  BASIC = 'basic',
  BUSINESS = 'business',
  ENTERPRISE = 'enterprise',
}

export enum OrganizationRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  BILLING_ADMIN = 'billing_admin',
  GUEST = 'guest',
}

export type OrganizationSettings = {
  allowPublicWorkspaces: boolean;
  requireEmailVerification: boolean;
  allowGuestAccess: boolean;
  defaultWorkspaceVisibility: 'private' | 'internal' | 'public';
  ssoEnabled: boolean;
  ssoProvider?: string;
  customDomain?: string;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    customLogo?: string;
  };
  security?: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
    sessionTimeout: number;
    allowedDomains?: string[];
  };
};

export type OrganizationBilling = {
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  trialEnd?: Date;
};

export type Organization = {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  ownerId?: string;
  plan: string;
  settings?: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  workspaceCount?: number;
  owner?: any;
  status?: any;
};

export type OrganizationState = {
  organization: Organization[]; // the array for the table
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
};

export type SuperAdminOrganizationListDto = {
  organizations: Organization[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type Members = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  contactNumber: string;
  hireDate: string;
  terminationDate: string;
  imageUrl: string;
  department: string;
  designation: string;
  employmentType: string;
  gender: string;
  address: string;
  status: string;
  joinedAt: string;

  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
    displayName: string;
  };
};
