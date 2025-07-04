declare const _exports: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "signed" | "rejected";
    width: number;
    height: number;
    documentId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    signerEmail: string;
    signerName: string;
    x: number;
    y: number;
    page: number;
    signatureText?: string | undefined;
    signedAt?: Date | undefined;
    rejectedAt?: Date | undefined;
    rejectionReason?: string | undefined;
    signatureToken?: string | undefined;
    ipAddress?: string | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "signed" | "rejected";
    width: number;
    height: number;
    documentId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    signerEmail: string;
    signerName: string;
    x: number;
    y: number;
    page: number;
    signatureText?: string | undefined;
    signedAt?: Date | undefined;
    rejectedAt?: Date | undefined;
    rejectionReason?: string | undefined;
    signatureToken?: string | undefined;
    ipAddress?: string | undefined;
}>>;
export = _exports;
import mongoose = require("mongoose");
//# sourceMappingURL=Signature.d.ts.map