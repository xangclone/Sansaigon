/**
 * Utility to compress and resize images before converting to Base64 data URL.
 * Prevents 413 Payload Too Large errors and browser memory crashes on smartphone camera photos.
 */
export const compressImageFile = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> => {
  return new Promise((resolve) => {
    // If not an image file, resolve empty string
    if (!file.type.startsWith('image/')) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        resolve('');
        return;
      }

      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // If image is small enough, return as is or compress lightly
        if (width <= maxWidth && height <= maxHeight && file.size < 300 * 1024) {
          resolve(dataUrl);
          return;
        }

        // Calculate aspect ratio scaling
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Export compressed JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        // Fallback to original read result if image loading fails
        resolve(dataUrl);
      };
    };

    reader.onerror = () => {
      resolve('');
    };
  });
};
