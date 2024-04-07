export interface JUser {
  id: string;
  avatarUrl: string;
  name: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  companyRoleName: string;
  profilePhoto?: string;
  address: string;
  contactPhone: string;
  status: string;
  isVerified: boolean;
  preferedLanguage: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  issueIds: string[];
}
