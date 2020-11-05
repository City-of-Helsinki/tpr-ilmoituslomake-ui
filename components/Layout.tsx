import React, { ReactNode, ReactElement } from "react";
// import Header from "./Header";
import Footer from "./Footer";
import styles from "./Layout.module.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps): ReactElement => {
  return (
    <div className={styles.layout}>
      <div className={styles.left} />
      <div className={styles.main}>
        {/* <Header /> */}
        {children}
        <Footer />
      </div>
      <div className={styles.right} />
    </div>
  );
};

export default Layout;
