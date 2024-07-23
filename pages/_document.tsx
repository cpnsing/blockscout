import { ColorModeScript } from '@chakra-ui/react';
import type { DocumentContext } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

import appConfig from 'configs/app/config';
import * as serverTiming from 'lib/next/serverTiming';
import theme from 'theme';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = async () => {
      const start = Date.now();
      const result = await originalRenderPage();
      const end = Date.now();

      serverTiming.appendValue(ctx.res, 'renderPage', end - start);

      return result;
    };

    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" sizes="32x32" href="/static/favicon-32x32.ico" />
          <link rel="icon" sizes="16x16" href="/static/favicon-16x16.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/static/favicon-16x16.ico" />
          <link rel="mask-icon" href="/static/safari-pinned-tab.svg" color="#5bbad5" />
          <meta property="og:title" content="Devnet: A block explorer designed for a decentralized world." />
          <meta
            property="og:description"
            // eslint-disable-next-line max-len
            content="Explore the Taral blockchain with Taral DevNet Explorer and witness seamless transactions. This will help you to search transactions hash, addresses, blocks, and tokens, and view pricing data easily to make better and strategic decisions."
          />
          <meta property="og:image" content={appConfig.baseUrl + '/static/og_taral.png'} />
          <meta property="og:site_name" content="Devnet" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:image" content={appConfig.baseUrl + '/static/og_twitter.png'} />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
