import "../styles/tailwind.css";
import Nav from "../components/Nav";

const App = ({ Component, pageProps }) => {
  return (
    <div className="min-h-screen safe-top bg-gray-900 relative">
      <Nav />
      <div className="pt-14">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default App;
