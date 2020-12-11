import Link from "next/link";
import Button from "../components/Button";

const Welcome = () => {
  return (
    <div className="container relative overflow-x-hidden overflow-y-visible h-screen safe-bottom">
      <div className="absolute-center z-20 w-full h-full flex flex-col justify-between items-center p-4">
        <div />
        <img src="/svg/ninetales-logo-vertical.svg" className="w-10/12 mx-auto" />

        <div className="flex items-center">
          <Link href="/register">
            <a>
              <Button variant="contained" className="mr-1">
                Register
              </Button>
            </a>
          </Link>

          <Link href="/login">
            <a>
              <Button variant="muted" className="ml-1">
                Log in
              </Button>
            </a>
          </Link>
        </div>
      </div>

      <div className="z-0 absolute-center w-full">
        <img src="/svg/ninetales-logo.svg" className="login-bg" />
      </div>
    </div>
  );
};

export default Welcome;
