export function getAuditTrail(req: any, res: any): Promise<any>;
export function getAllAudits(req: any, res: any): Promise<void>;
export function createAuditEntry(documentId: any, userId: any, action: any, details: any, metadata?: {}): Promise<import("mongoose").Document<unknown, any, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    documentId: import("mongoose").Types.ObjectId;
    action: "document_uploaded" | "signature_added" | "signature_signed" | "signature_rejected" | "document_finalized";
    metadata?: any;
    userId?: import("mongoose").Types.ObjectId | undefined;
    ipAddress?: string | undefined;
    details?: string | undefined;
    userAgent?: string | undefined;
}> & Omit<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    documentId: import("mongoose").Types.ObjectId;
    action: "document_uploaded" | "signature_added" | "signature_signed" | "signature_rejected" | "document_finalized";
    metadata?: any;
    userId?: import("mongoose").Types.ObjectId | undefined;
    ipAddress?: string | undefined;
    details?: string | undefined;
    userAgent?: string | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
}, never>>;
//# sourceMappingURL=auditController.d.ts.map