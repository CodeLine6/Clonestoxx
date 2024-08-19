export const ImgSchema = z.object({
    fileName: z.string(),
    name: z.string(),
    fileSize: z.number(),
    size: z.number(),
    fileKey: z.string(),
    key: z.string(),
    fileUrl: z.string(),
    url: z.string()
});