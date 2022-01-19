import _ from '$lib/cachestore';
import { useEffect } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    window._ = _;
  }, []);
  return (<Component {...pageProps} />);
}

export default MyApp;
