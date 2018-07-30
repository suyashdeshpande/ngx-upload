export interface INgxUploader {
  fileSize: number | string | null;
  fileType: string | string[] | null;
  height: number | string | null;

  // Only for images
  minWidth: number | string | null;
  maxWidth: number | string | null;
  minHeight: number | string | null;
  maxHeight: number | string | null;
  quality: number | string | null;
}
