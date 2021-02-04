import React, { ReactNode, ReactElement, useEffect, useRef } from "react";
import Footer from "./Footer";
import styles from "./Layout.module.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The layout is hidden during server-side rendering so that large svg icons are not shown momentarily (in production mode)
    // Restore the proper layout styling after client-side rendering here
    if (ref.current) {
      ref.current.className = styles.layout;
    }
  });

  return (
    <div className="hidden" ref={ref}>
      <div className={styles.left} />
      <div className={styles.main}>
        {children}
        <Footer />
      </div>
      <div className={styles.right} />
    </div>
  );
};

export default Layout;
