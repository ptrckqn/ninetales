import React from 'react';
import Loading from '../Loading';

const Splash = () => {
  return (
    <div className="flex flex-col h-screen justify-between items-center px-4 safe-top safe-bottom">
      <div />
      <img src="/svg/ninetales-logo-vertical.svg" className="w-3/4 max-w-3xl" />
      <div>
        <Loading />
      </div>
    </div>
  );
};

export default Splash;
