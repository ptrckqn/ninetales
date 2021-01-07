import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { get } from 'lodash';
import { useAuth } from '../../context/authContext';

const Dock = () => {
  const auth = useAuth();
  const location = useLocation();

  const currentTab = useMemo(() => {
    return location.pathname.split('/')[1];
  }, [location]);

  return (
    <div className="fixed w-screen bottom-0 left-0 bg-gray-600 safe-bottom z-40">
      <div className="p-4 flex justify-around">
        <Link to="/">
          <button className="h-8">
            <img src={currentTab ? '/svg/home-outlined.svg' : '/svg/home-filled.svg'} className="h-8" />
          </button>
        </Link>

        <Link to="/upload">
          <div className="h-8 -mt-2">
            <div className={`h-12 w-12 rounded-full flex justify-center items-center ${currentTab === 'upload' ? 'bg-orange-main' : 'bg-gray-400'}`}>
              <button>
                <img src="/svg/plus.svg" className="h-8" />
              </button>
            </div>
          </div>
        </Link>

        <Link to={`/${get(auth, 'username', '').toLowerCase()}`}>
          <button className="h-8">
            <img src={currentTab === get(auth, 'username', ' ').toLowerCase() ? '/svg/user-filled.svg' : '/svg/user-outlined.svg'} className="h-8 rounded-full object-cover" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Dock;
