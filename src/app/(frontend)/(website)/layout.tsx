import Script from "next/script"
import Header from './_components/Header'
import Footer from './_components/Footer'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Meta Pixel Code - start */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1454534582531274');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1454534582531274&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel Code - end */}

      {/* Google Analytics - Google tag (gtag.js) */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-SH5EZVJWFM" strategy="afterInteractive" />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SH5EZVJWFM');
            `,
        }}
      />
      {/* End Google Analytics - Google tag (gtag.js) */}


      <Header />
      {children}
      <Footer />
    </>
  )
}
