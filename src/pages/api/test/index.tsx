import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Script from 'next/script';

const WidgetPage: NextPage = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div>
      {isClient ? (
        <body>
          {/*<Script src="https://atb-prod.planner-web.mittatb.no/widget/C4Jw9gtgzkA/2.36.0/planner-web.umd.js"></Script>*/}
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <Script
            strategy="afterInteractive"
            onLoad={() => console.log('Widget loaded successfully')}
            onError={(e) =>
              console.log('Widget load error: ' + JSON.stringify(e))
            }
            src="https://atb-prod.planner-web.mittatb.no/widget/C4Jw9gtgzkA/2.16.1/planner-web.umd.js"
          ></Script>
          <link
            rel="stylesheet"
            href="https://atb-prod.planner-web.mittatb.no/widget/C4Jw9gtgzkA/2.16.1/planner-web.css"
          />
          <Script
            strategy="afterInteractive"
            id="init"
            onLoad={() => console.log('Inline loaded successfully')}
            onError={(e) =>
              console.log('Inline load error: ' + JSON.stringify(e))
            }
          >
            {`
              // Ensure that url base is same origin as the page where
              // widget is loaded and the travel planner API
              console.log("Creating widget. Planner web: " + JSON.stringify(window.PlannerWeb, null, 2));
              const widget = window.PlannerWeb.createWidget({
              urlBase: 'https://atb-prod.planner-web.mittatb.no',
              language: 'nn', // supports 'nb', 'nn' and 'en'

              // Optional options
              outputOverrideOptions: {
              // Inherit font from page website.
              // By default it uses Roboto as the hosted planner web solution.
              inheritFont: false,
              // Use single column design of widget layout
              singleColumnLayout: false,
            },
            });
            console.log("Created widget");

              // After loading JS and CSS file it can be initialized
              // using the following code:
              widget.init();
          `}
          </Script>
        </body>
      ) : null}
    </div>
  );
};

export default WidgetPage;
