import "typeface-montserrat";
import "../styles/tailwind.css";
import { AuthProvider } from "../context/authContext";

const App = ({ Component, pageProps }) => {
  return (
    <AuthProvider>
      <div className="min-h-screen safe-top bg-gray-800 relative font-sans">
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
};

export default App;
