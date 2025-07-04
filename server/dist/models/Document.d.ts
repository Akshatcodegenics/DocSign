declare const _exports: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    title: string;
    filename: string;
    originalName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: mongoose.Types.ObjectId;
    status: "pending" | "signed" | "rejected";
    pages: number;
    documentType: "text" | "pdf" | "word" | "excel" | "powerpoint" | "csv" | "image";
    processingStatus: "processing" | "ready" | "error";
    supportsBiometricSignatures: boolean;
    supportsBlockchainAudit: boolean;
    processingError?: string | undefined;
    metadata?: {
        author?: string | undefined;
        subject?: string | undefined;
        keywords?: string | undefined;
        creationDate?: Date | undefined;
        modificationDate?: Date | undefined;
        dimensions?: {
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
    } | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    title: string;
    filename: string;
    originalName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: mongoose.Types.ObjectId;
    status: "pending" | "signed" | "rejected";
    pages: number;
    documentType: "text" | "pdf" | "word" | "excel" | "powerpoint" | "csv" | "image";
    processingStatus: "processing" | "ready" | "error";
    supportsBiometricSignatures: boolean;
    supportsBlockchainAudit: boolean;
    processingError?: string | undefined;
    metadata?: {
        author?: string | undefined;
        subject?: string | undefined;
        keywords?: string | undefined;
        creationDate?: Date | undefined;
        modificationDate?: Date | undefined;
        dimensions?: {
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
    } | undefined;
}>>;
export = _exports;
import mongoose = require("mongoose");
//# sourceMappingURL=Document.d.ts.map