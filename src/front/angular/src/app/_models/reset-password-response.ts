// model koji se dobija nakon usepsne verifikacije emaila
export interface ResetPasswordAfterEmailConformation {
    token: string,
    email: string
}