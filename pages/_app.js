import "typeface-montserrat";
import "../styles/tailwind.css";
import { useEffect } from "react";
import Head from "next/head";
import { AuthProvider } from "../context/authContext";

const App = ({ Component, pageProps }) => {
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     window.addEventListener("load", () => {
  //       navigator.serviceWorker.register("/sw.js");
  //     });
  //   }
  // }, []);

  return (
    <>
      <Head>
        <title>Ninetales</title>

        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
      </Head>
      <AuthProvider>
        <div className="min-h-screen safe-top bg-gray-800 relative font-sans">
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </>
  );
};

export default App;
