import request, { RequestPromise } from "./shared/api/request";

export type UploadImageResult = {
  url: string;
};
export function uploadImage(
  formData: FormData,
  token?: string,
): RequestPromise<UploadImageResult> {
  //   const form = new FormData();
  //   form.append("file", file);
  return request({
    url: "/medium/upload",
    method: "post",
    data: formData,
    headers: {
      needToken: true,
      token,
    },
  });
}
