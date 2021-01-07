import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useNav } from '../../context/navContext';

const Nav = () => {
  const history = useHistory();
  const {
    navProps: { showBack, handleNext, nextBtn, loading, noSearch },
  } = useNav();

  const handleBack = () => {
    history.goBack();
  };

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

        {!noSearch && (
          <>
            {nextBtn ? (
              <button className="text-white font-bold " onClick={handleNext} disabled={loading}>
                {loading ? <img src="/svg/loader.svg" className="animate-spin mr-2 inline h-6 w-6" /> : nextBtn}
              </button>
            ) : (
              <Link to="/search">
                <button>
                  <img src="/svg/search.svg" className="h-8" />
                </button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Nav;
