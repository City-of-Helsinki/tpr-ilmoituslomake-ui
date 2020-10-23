import React, { ReactNode, ReactElement } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps): ReactElement => {
  return (
    <div>
      <div>HEADER</div>
      {children}
      <div>FOOTER</div>
    </div>
  );
};

export default Layout;
