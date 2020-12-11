import Nav from "../Nav";
import Dock from "../Dock";

const Container = ({ showBack, children }) => {
  return (
    <div className="relative container flex flex-col overflow-x-hidden min-h-screen pt-2">
      <Nav showBack={showBack} />
      <main className="mt-12 mb-16 safe-top">{children}</main>

      <Dock />
    </div>
  );
};

export default Container;
