declare const _exports: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    documentId: mongoose.Types.ObjectId;
    action: "document_uploaded" | "signature_added" | "signature_signed" | "signature_rejected" | "document_finalized";
    metadata?: any;
    userId?: mongoose.Types.ObjectId | undefined;
    ipAddress?: string | undefined;
    details?: string | undefined;
    userAgent?: string | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    documentId: mongoose.Types.ObjectId;
    action: "document_uploaded" | "signature_added" | "signature_signed" | "signature_rejected" | "document_finalized";
    metadata?: any;
    userId?: mongoose.Types.ObjectId | undefined;
    ipAddress?: string | undefined;
    details?: string | undefined;
    userAgent?: string | undefined;
}>>;
export = _exports;
import mongoose = require("mongoose");
//# sourceMappingURL=Audit.d.ts.map