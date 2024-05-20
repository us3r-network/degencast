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
