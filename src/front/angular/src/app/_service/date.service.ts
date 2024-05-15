import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DateService {

    public static convertToUTC(date: Date): Date {
        return new Date(
            Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            )
        )
    }
}