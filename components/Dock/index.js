import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Dock = () => {
  const router = useRouter();

  const currentTab = useMemo(() => {
    return router.pathname.split("/")[1];
  }, [router]);

  return (
    <div className="fixed w-screen bottom-0 left-0 bg-gray-600 rounded-t-lg safe-bottom z-40">
      <div className="p-4 flex justify-around">
        <Link href="/">
          <a className="h-8">
            <button>
              <img src={currentTab ? "/svg/home-outlined.svg" : "/svg/home-filled.svg"} className="h-8" />
            </button>
          </a>
        </Link>

        <Link href="/upload">
          <a className="h-8 -mt-2">
            <div className="h-12 w-12 rounded-full bg-gray-400 flex justify-center items-center">
              <button>
                <img src={currentTab ? "/svg/home-outlined.svg" : "/svg/plus.svg"} className="h-8" />
              </button>
            </div>
          </a>
        </Link>

        <Link href="/">
          <a className="h-8">
            <button>
              <img src={currentTab === "user" ? "/svg/user-filled.svg" : "/svg/user-outlined.svg"} className="h-8" />
            </button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Dock;
