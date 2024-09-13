import { ScrollViewStyleReset } from "expo-router/html";
import { Asset } from "expo-asset";
import { DEGENCAST_FRAME_HOST } from "~/constants";
const degencastLoadingGif = Asset.fromModule(
  require("assets/images/degencast-loading.gif"),
);

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* <!-- join waitlist frame --> */}
        <meta name="fc:frame" content="vNext" />
        <meta
          name="fc:frame:image"
          content={`${DEGENCAST_FRAME_HOST}/images/waitlist/join-waitlist.png`}
        />
        <meta
          name="fc:frame:post_url"
          content={`${DEGENCAST_FRAME_HOST}/waitlist/frames`}
        />
        <meta name="fc:frame:button:1" content="Join Waitlist" />
        {/* <!-- join waitlist frame --> */}

        {/* Link the PWA manifest file. */}
        <link rel="manifest" href="/manifest.json" />
        {/* 
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native. 
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>
        {children}
        <img src={degencastLoadingGif.uri} id="degencast-loading" />
      </body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}
  #degencast-loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    width: 60px;
    height: 60px;
  }
`;
