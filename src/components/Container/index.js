import React from 'react';
import Nav from '../Nav';
import Dock from '../Dock';

const Container = ({ showBack, handleNext, nextBtn, loading, noSearch, children }) => {
  return (
    <div className="relative container flex flex-col overflow-x-hidden min-h-screen pt-2">
      <Nav showBack={showBack} handleNext={handleNext} nextBtn={nextBtn} noSearch={noSearch} loading={loading} />
      <main className="mt-11 mb-16 safe-top safe-bottom flex-grow h-full">{children}</main>
      <Dock />
    </div>
  );
};

export default Container;
