import React from 'react';
import { useLoaderData } from 'react-router';
import Card from '../components/ui/Card/Card';
import styles from './StaticPage.module.css';

export { loader } from './StaticPage.server';

const StaticPage: React.FC = () => {
  const { content } = useLoaderData() as { content: { title: string, content: string } };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <h1 className={styles.title}>{content.title}</h1>
        <div className={styles.content}>
          {content.content}
        </div>
      </Card>
    </div>
  );
};

export default StaticPage;
