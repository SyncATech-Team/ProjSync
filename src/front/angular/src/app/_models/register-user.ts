// model za registraciju koji odgovara RegisterDto na backend-u
export interface RegisterModel {
    firstName: string
    lastName: string
    email: string
    username: string
    password: string
    companyRole: string
    address: string
    contactPhone: string
  }