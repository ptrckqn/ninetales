import Link from "next/link";
import { useRouter } from "next/router";

const Nav = ({ showBack, noSearch, handleNext, nextBtn, loading }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleSearch = () => {};

  return (
    <div className="fixed top-0 w-full bg-gray-800  px-4 border-b-2 border-orange-main z-40">
      <div className="flex justify-between items-center py-2">
        <div className="flex">
          {showBack && (
            <button className="mr-2" onClick={handleBack}>
              <img src="/svg/chevron-left.svg" className="h-8" />
            </button>
          )}
          <img src="/svg/ninetales-logo.svg" className="h-10" />
        </div>

        {!noSearch && (
          <>
            {nextBtn ? (
              <button className="text-white font-bold " onClick={handleNext} disabled={loading}>
                {loading ? <img src="/svg/loader.svg" className="animate-spin mr-2 inline h-6 w-6" /> : nextBtn}
              </button>
            ) : (
              <Link href="/search">
                <a>
                  <button>
                    <img src="/svg/search.svg" className="h-8" />
                  </button>
                </a>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Nav;
