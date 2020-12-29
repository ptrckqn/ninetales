import "typeface-montserrat";
import "../styles/tailwind.css";
import Head from "next/head";
import { AuthProvider } from "../context/authContext";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Ninetales</title>
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
