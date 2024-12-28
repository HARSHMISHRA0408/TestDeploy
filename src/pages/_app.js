// import '@/styles/globals.css';

// function App({ Component, pageProps }) {
//   // Check if the page has a layout function, apply it if it exists
//   const getLayout = Component.getLayout || ((page) => page);

//   // Return the page wrapped in the layout (if defined)
//   return getLayout(<Component {...pageProps} />);
// }

// export default App;

import '@/styles/globals.css';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure `nprogress` to start/stop during route changes
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function App({ Component, pageProps }) {
  // Check if the page has a layout function, apply it if it exists
  const getLayout = Component.getLayout || ((page) => page);

  // Return the page wrapped in the layout (if defined)
  return getLayout(<Component {...pageProps} />);
}

export default App;
