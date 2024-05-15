import { UserGetter } from "./user-getter";

export interface UserGetterLazyLoad {
    users: UserGetter[],
    numberOfRecords: number
}