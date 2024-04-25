import { FarCast } from "~/services/farcaster/types";

export function isImg(url?: string) {
  if (!url) return false;
  return (
    url.endsWith(".png") ||
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".gif") ||
    url.startsWith("https://imagedelivery")
  );
}

export function isVideo(url?: string) {
  if (!url) return false;
  return (
    url.endsWith(".mp4") ||
    url.endsWith(".mov") ||
    url.endsWith(".avi") ||
    url.endsWith(".webm") ||
    url.endsWith(".mkv") ||
    url.endsWith(".m3u8")
  );
}

export type Embeds = {
  imgs: {
    url: string;
  }[];
  videos: { url: string }[];
  webpages: {
    url: string;
  }[];
  casts: {
    castId: { fid: number; hash: string };
  }[];
};

export function formatEmbeds(embeds: FarCast["embeds"]): Embeds {
  const imgs = [];
  const videos = [];
  const webpages = [];
  const casts = [];

  for (const embed of embeds) {
    if (embed?.cast_id) {
      casts.push(embed);
    } else if (embed?.castId) {
      casts.push(embed);
    } else if (embed?.url) {
      if (isImg(embed.url)) {
        imgs.push({
          url: embed.url,
        });
      } else if (isVideo(embed.url)) {
        videos.push({
          url: embed.url,
        });
      } else {
        webpages.push({
          url: embed.url,
        });
      }
    }
  }
  return { imgs, webpages, casts, videos };
}

export function getEmbeds(cast: FarCast): Embeds {
  return formatEmbeds(cast.embeds);
}
