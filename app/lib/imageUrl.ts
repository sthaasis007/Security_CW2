export function buildImageUrl(image?: string | null) {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/")) {
    return image;
  }

  // In browser, prefer the frontend-relative path so Next.js can proxy `/uploads` to the backend.
  if (typeof window !== "undefined") {
    return `/uploads/${image}`;
  }

  // On the server (SSR / build), fallback to NEXT_PUBLIC_API_URL if configured.
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (apiBase) {
    return `${apiBase}/uploads/${image}`;
  }

  return `/uploads/${image}`;
}
