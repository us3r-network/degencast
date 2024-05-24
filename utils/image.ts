export const imgLinkToBase64 = async (imgLink: string): Promise<string> => {
  const response = await fetch(imgLink);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export function imgBase64ToBlob(base64: string): Blob {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: "image/png" });
}

export async function imgLinkToBlob(imgLink: string): Promise<Blob> {
  const response = await fetch(imgLink, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const blob = await response.blob();
  if (!blob) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  return blob;
}
