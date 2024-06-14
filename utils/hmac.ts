import hmac from "js-crypto-hmac";
import jseu from "js-encoding-utils";

// 前端生成HMAC signature http header：X-HMAC-SIGNATURE 方法：
export async function computeHmac(key: string, msg: string): Promise<string> {
  const mac = await hmac.compute(
    jseu.encoder.stringToArrayBuffer(key),
    jseu.encoder.stringToArrayBuffer(msg),
    "SHA3-512",
  );

  return jseu.encoder.arrayBufferToString(mac);
}
