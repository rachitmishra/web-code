import React, { useState, useEffect } from 'react';
import { useSubmit, useActionData, useLoaderData } from 'react-router';
import { type StorefrontSettings, DEFAULT_SETTINGS } from '../../services/storefrontService';
import { updateStorefrontSettings, getStorefrontSettings } from '../../services/storefrontService.server';
import { requireRole } from '../../lib/auth.server';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import Card from '../../components/ui/Card/Card';
import styles from './Storefront.module.css';

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const settings = await getStorefrontSettings();
  return { settings };
}

export async function action({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const formData = await request.formData();
  const settingsJson = formData.get("settings") as string;
  
  try {
    const settings = JSON.parse(settingsJson);
    await updateStorefrontSettings(settings);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

const PageManager: React.FC = () => {
  const { settings: initialSettings } = useLoaderData() as { settings: StorefrontSettings };
  const actionData = useActionData() as { success: boolean, error?: string };
  const submit = useSubmit();

  const [settings, setSettings] = useState<StorefrontSettings>(initialSettings || DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const pageContent = settings.pageContent || {};

  useEffect(() => {
    if (actionData) {
      setSaving(false);
      if (actionData.success) {
        setStatus({ type: 'success', message: 'Page content saved successfully!' });
      } else {
        setStatus({ type: 'error', message: `Error: ${actionData.error}` });
      }
    }
  }, [actionData]);

  const handleUpdatePage = (path: string, field: 'title' | 'content', value: string) => {
    setSettings({
      ...settings,
      pageContent: {
        ...pageContent,
        [path]: {
          ...pageContent[path],
          [field]: value
        }
      }
    });
  };

  const handleAddPage = () => {
    const path = prompt("Enter page path (e.g., /new-page):");
    if (path && !pageContent[path]) {
      setSettings({
        ...settings,
        pageContent: {
          ...pageContent,
          [path]: { title: 'New Page', content: '' }
        }
      });
    }
  };

  const handleRemovePage = (path: string) => {
    if (confirm(`Are you sure you want to remove ${path}?`)) {
      const newPageContent = { ...pageContent };
      delete newPageContent[path];
      setSettings({ ...settings, pageContent: newPageContent });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    
    submit(
      { settings: JSON.stringify(settings) },
      { method: 'post' }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1>Static Page Manager</h1>
        <Button type="button" variant="secondary" onClick={handleAddPage}>Add New Page</Button>
      </div>
      
      <Card>
        <form className={styles.form} onSubmit={handleSubmit}>
          {Object.entries(pageContent).map(([path, data]) => (
            <section key={path} className={styles.section} style={{ marginBottom: '2rem', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
              <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Path: {path}</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleRemovePage(path)}
                  style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                >
                  Delete Page
                </Button>
              </div>
              <Input
                label="Page Title"
                value={data.title}
                onChange={(e) => handleUpdatePage(path, 'title', e.target.value)}
                required
              />
              <div className={styles.field}>
                <label className={styles.label}>Content (Markdown supported)</label>
                <textarea
                  className={styles.textarea}
                  value={data.content}
                  onChange={(e) => handleUpdatePage(path, 'content', e.target.value)}
                  style={{ 
                    width: '100%', 
                    minHeight: '200px', 
                    backgroundColor: 'transparent', 
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    padding: '1rem',
                    fontFamily: 'inherit'
                  }}
                  required
                />
              </div>
            </section>
          ))}

          <Button type="submit" loading={saving} style={{ marginTop: '2rem' }}>
            Save All Page Content
          </Button>
        </form>

        {status && (
          <div className={`${styles.status} ${status.type === 'success' ? styles.success : styles.error}`} style={{ marginTop: '1rem' }}>
            {status.message}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PageManager;
