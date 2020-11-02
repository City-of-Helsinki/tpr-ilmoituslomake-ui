import React, { ReactNode, ReactElement } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps): ReactElement => {
  return (
    <div>
      {/* <Header /> */}
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
