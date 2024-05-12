import { Injectable, EventEmitter } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DocumentRefreshService {

    refreshDocumentList: EventEmitter<void> = new EventEmitter<void>();

    constructor() { }

}