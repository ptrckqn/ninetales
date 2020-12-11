import Link from "next/link";
import { useRouter } from "next/router";

const Nav = ({ showBack }) => {
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
    <div className="flex justify-between items-baseline">
      <div>
        {showBack && (
          <button className="mr-2" onClick={handleBack}>
            <img src="/svg/chevron-left.svg" className="h-8" />
          </button>
        )}
        <img src="/svg/ninetales-logo.svg" className="h-12" />
      </div>

      <Link href="/s">
        <a>
          <button>
            <img src="/svg/search.svg" className="h-8" />
          </button>
        </a>
      </Link>
    </div>
  );
};

export default Nav;
