type ImageType = {
    mime: string;
    extension: string;
};
export declare const imageType: (buffer: Buffer) => ImageType | null;
export declare const containsPolyglotPayload: (buffer: Buffer) => boolean;
export declare const generateImageFilename: (extension: string) => string;
export declare const uploadSingle: (_fieldName?: string) => (req: any, res: any, next: any) => void;
export default uploadSingle;
//# sourceMappingURL=upload.middleware.d.ts.map