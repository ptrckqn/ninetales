import Link from "next/link";
import { useRouter } from "next/router";

const Nav = ({ showBack, handleNext, nextBtn }) => {
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
    <div className="fixed top-0 w-full bg-gray-800  px-4 safe-top border-b-2 border-orange-main z-40">
      <div className="flex justify-between items-center py-2">
        <div className="flex">
          {showBack && (
            <button className="mr-2" onClick={handleBack}>
              <img src="/svg/chevron-left.svg" className="h-8" />
            </button>
          )}
          <img src="/svg/ninetales-logo.svg" className="h-10" />
        </div>

        {nextBtn ? (
          <button className="text-white font-bold " onClick={handleNext}>
            {nextBtn}
          </button>
        ) : (
          <Link href="/s">
            <a>
              <button>
                <img src="/svg/search.svg" className="h-8" />
              </button>
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Nav;