import React, { useEffect, useRef } from "react";

export default function WebVideoRender({ src }: { src: string }) {
  const videoRef = useRef(null);
  const playerRef = useRef<any>(null);
  const [mounted, setMounted] = React.useState(false);

  // TODO 引入videojs 包在编译时有bug(videojs内部bug, window is not defined), 先用cdn引入
  useEffect(() => {
    if (
      !document.querySelector(
        'link[href="https://vjs.zencdn.net/8.10.0/video-js.css"]',
      )
    ) {
      const link = document.createElement("link");
      link.href = "https://vjs.zencdn.net/8.10.0/video-js.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (
      !document.querySelector(
        'script[src="https://vjs.zencdn.net/8.10.0/video.min.js"]',
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://vjs.zencdn.net/8.10.0/video.min.js";
      document.body.appendChild(script);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const videojs = (window as any).videojs as any;
      if (videojs) {
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          autoplay: false,
          preload: "auto",
          fluid: true,
          fill: true,
          responsive: true,
        });
      }
    }
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.pause();
      }
    };
  }, [mounted]);

  const type = src?.endsWith(".m3u8")
    ? "application/x-mpegURL"
    : src?.endsWith(".mp4")
      ? "video/mp4"
      : "";

  return (
    <div
      data-vjs-player
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <video
        ref={videoRef}
        className="video-js"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <source src={src} type={type} />
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to
          a web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video
          </a>
        </p>
      </video>
    </div>
  );
}
