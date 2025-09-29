import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect, useState } from 'react';

// Configure `nprogress` to start/stop during route changes
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  //code to disable right click
  useEffect(() => {
    // Disable right-click globally
    const disableContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", disableContextMenu);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);

  // Check if the page has a layout function, apply it if it exists
  const getLayout = Component.getLayout || ((page) => page);

  // Return the page wrapped in the layout (if defined)
 return getLayout(
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;
