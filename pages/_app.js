import { Provider } from "react-redux";
import { store } from "@/store";
import Head from "next/head";
import { AuthProvider } from './../context/AuthContext'

function MyApp({ Component, pageProps }) {
  return (
      <Provider store={store}>
            <Head>
          <title>{`demo`}</title>
          <meta name='description' content={`khushalo_demo`} />
          <meta name='keywords' content='' />
              <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <AuthProvider>

      <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  );
}

export default MyApp;