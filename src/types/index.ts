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
  size?: string; // '1-10', '11-50', etc.
  ownerId: string;
  plan: OrganizationPlan;
  settings?: OrganizationSettings;
  billing?: OrganizationBilling;
  isActive: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Derived / virtual fields from backend
  memberCount?: number;
  workspaceCount?: number;
};
