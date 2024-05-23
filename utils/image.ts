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

export const imgLinkToBase64WithCors = async (
  imgLink: string,
): Promise<string> => {
  const response = await fetch(imgLink, {
    method: "GET",
    mode: "no-cors",
  });
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

// export async function imgLinkToBase64WithCors(
//   imgLink: string,
// ): Promise<string> {
//   return new Promise((resolve, reject) => {
//     // 创建一个图片元素
//     const img = new Image();

//     // 设置图片地址
//     img.src = imgLink;
//     img.setAttribute("crossOrigin", "Anonymous");

//     // 创建一个 canvas 元素
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     // 当图片加载完成后执行
//     img.onload = function () {
//       // 设置 canvas 的宽度和高度与图片相同
//       canvas.width = img.width;
//       canvas.height = img.height;

//       // 在 canvas 上绘制图片
//       ctx?.drawImage(img, 0, 0);

//       // 将 canvas 导出为 base64 编码的图像数据
//       const base64ImageData = canvas.toDataURL("image/jpeg");

//       // 返回 base64 数据
//       resolve(base64ImageData);
//       canvas.remove();
//     };

//     // 如果图片加载失败，则返回错误信息
//     img.onerror = function () {
//       reject(new Error("Failed to load image"));
//     };
//   });
// }

export function imgBase64ToBlob(base64: string): Blob {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: "image/png" });
}

export async function imgLinkToBlobWithCors(imageOriginUrl: string) {
  const base64Img = await imgLinkToBase64WithCors(imageOriginUrl);
  return imgBase64ToBlob(base64Img);
}
