import React from 'react';
import Nav from '../Nav';
import Dock from '../Dock';

const Container = ({ children }) => {
  return (
    <div className="relative container flex flex-col overflow-x-hidden min-h-screen pt-2">
      <Nav />
      <main className="mt-12 mb-18 safe-top safe-bottom flex-grow h-full">{children}</main>
      <Dock />
    </div>
  );
};

export default Container;
