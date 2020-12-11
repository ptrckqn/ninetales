import "typeface-montserrat";
import "../styles/tailwind.css";

const App = ({ Component, pageProps }) => {
  return (
    <div className="min-h-screen safe-top bg-gray-800 relative font-sans">
      <Component {...pageProps} />
    </div>
  );
};

export default App;
