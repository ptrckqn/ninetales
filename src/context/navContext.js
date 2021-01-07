import { createContext, useContext, useState } from 'react';

const INIT_NAV = { showBack: false, handleNext: null, nextBtn: null, loading: false, noSearch: false };

const NavContext = createContext(INIT_NAV);

export const NavProvider = ({ children }) => {
  const [navProps, setNavProps] = useState(INIT_NAV);

  const updateNav = (updatedState) => {
    setNavProps({ ...navProps, ...updatedState });
  };

  const resetNav = () => {
    setNavProps(INIT_NAV);
  };

  return <NavContext.Provider value={{ navProps, updateNav, resetNav }}>{children}</NavContext.Provider>;
};

export const useNav = () => {
  return useContext(NavContext);
};
