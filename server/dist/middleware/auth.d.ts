export = auth;
declare function auth(req: any, res: any, next: any): Promise<any>;
declare namespace auth {
    export { memoryUsers };
}
declare let memoryUsers: any[];
//# sourceMappingURL=auth.d.ts.map