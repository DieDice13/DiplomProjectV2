import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => (
  <div className="mx-auto w-full max-w-[1440px] px-[15px] sm:px-[40px]">{children}</div>
);

export default Container;
