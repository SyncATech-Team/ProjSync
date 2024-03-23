export interface UserGetter {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    companyRoleName: string;
    profilePhoto: string;
    address: string;
    contactPhone: string;
    status: string;
    isVerified: boolean;
    preferedLanguage: string;
    createdAt?: Date;
    updatedAt?: Date;
}