import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        © 2025 Steam Clone. All rights reserved.
      </footer>
    </div>
  );
}
