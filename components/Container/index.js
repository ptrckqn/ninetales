import Nav from "../Nav";
import Dock from "../Dock";

const Container = ({ showBack, children }) => {
  return (
    <div className="container flex flex-col overflow-x-hidden min-h-screen p-4">
      <Nav showBack={showBack} />
      {children}
      <Dock />
    </div>
  );
};

export default Container;
