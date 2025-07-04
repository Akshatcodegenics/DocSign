import { Response, NextFunction } from 'express';
declare const uploadDocument: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
declare const getDocument: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
declare const signDocument: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export { uploadDocument, getDocument, signDocument };
//# sourceMappingURL=apiController.d.ts.map