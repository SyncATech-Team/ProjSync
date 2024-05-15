
export interface DocumentTitle {
    documentId: number,
    title: string,
    dateUploaded: Date,
    olderVersions: DocumentTitle[],
    showOlderVersions: false
}