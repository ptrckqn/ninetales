import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { firebase } from "../firebase/config";
import Button from "../components/Button";

const Welcome = () => {
  const router = useRouter();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        router.push("/");
      }
    });
  }, []);

  return (
    <div className="container relative overflow-x-hidden overflow-y-visible h-screen safe-bottom">
      <div className="absolute-center z-20 w-full h-full flex flex-col justify-between items-center p-4">
        <div />
        <img src="/svg/ninetales-logo-vertical.svg" className="w-10/12 mx-auto" />

        <div className="flex justify-stretch items-center safe-bottom">
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
