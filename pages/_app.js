import { Provider } from "react-redux";
import { store } from "@/store";
import Head from "next/head";


function MyApp({ Component, pageProps }) {
  return (
      <Provider store={store}>
            <Head>
          <title>{`spiral`}</title>
          <meta name='description' content={`spiraltechnolab`} />
          <meta name='keywords' content='' />
              <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;