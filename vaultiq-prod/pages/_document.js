import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="VaultIQ — Your AI Business Strategist. Launch fast, scale smart, win globally." />
        <meta name="theme-color" content="#4F46E5" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%234F46E5'/><text y='.9em' font-size='60' x='12' fill='white' font-weight='bold'>VQ</text></svg>" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
