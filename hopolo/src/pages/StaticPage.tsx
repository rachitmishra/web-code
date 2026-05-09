import React from 'react';
import { useLoaderData, useParams } from 'react-router';
import { getStorefrontSettings } from '../services/storefrontService.server';
import { DEFAULT_SETTINGS } from '../services/storefrontService';
import Card from '../components/ui/Card/Card';
import styles from './StaticPage.module.css';

export async function loader({ request }: { request: Request }) {
  const settings = await getStorefrontSettings() || DEFAULT_SETTINGS;
  const url = new URL(request.url);
  const path = url.pathname;
  
  const content = settings.pageContent?.[path] || {
    title: 'Not Found',
    content: 'The requested information is not available at this time.'
  };

  return { content };
}

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
