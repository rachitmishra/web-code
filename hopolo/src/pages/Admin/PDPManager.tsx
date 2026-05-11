import React, { useState, useEffect } from 'react';
import { useSubmit, useActionData, useLoaderData } from 'react-router';
import { type PDPLayout, type PDPPluginConfig } from '../../services/storefrontService';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import styles from './PDPManager.module.css';

export { loader, action } from './PDPManager.server';

const PDPManager: React.FC = () => {
  const { layout: initialLayout } = useLoaderData() as { layout: PDPLayout };
  const actionData = useActionData() as { success: boolean, error?: string };
  const submit = useSubmit();

  const [layout, setLayout] = useState<PDPLayout>(initialLayout);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (actionData) {
      setSaving(false);
      if (actionData.success) {
        setStatus({ type: 'success', message: 'Layout saved successfully!' });
      } else {
        setStatus({ type: 'error', message: `Error: ${actionData.error}` });
      }
    }
  }, [actionData]);

  const handleToggleVisibility = (index: number) => {
    const newPlugins = [...layout.plugins];
    newPlugins[index] = { ...newPlugins[index], visible: !newPlugins[index].visible };
    setLayout({ ...layout, plugins: newPlugins });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newPlugins = [...layout.plugins];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newPlugins.length) return;
    
    [newPlugins[index], newPlugins[targetIndex]] = [newPlugins[targetIndex], newPlugins[index]];
    setLayout({ ...layout, plugins: newPlugins });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    submit(
      { layout: JSON.stringify(layout) },
      { method: 'post' }
    );
  };

  return (
    <div className={styles.container}>
      <h1>PDP Layout Manager</h1>
      
      <Card>
        <form onSubmit={handleSave}>
          <div className={styles.pluginList}>
            {layout.plugins.map((plugin, index) => (
              <div key={plugin.id} className={styles.pluginItem}>
                <div className={styles.pluginInfo}>
                  <span className={styles.pluginType}>{plugin.type}</span>
                  <span className={styles.pluginId}>ID: {plugin.id}</span>
                </div>
                <div className={styles.pluginActions}>
                  <div className={styles.reorderButtons}>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      title="Move Up"
                      className={styles.iconBtn}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === layout.plugins.length - 1}
                      title="Move Down"
                      className={styles.iconBtn}
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  <div className={styles.toggleField}>
                    <input
                      id={`visible-${plugin.id}`}
                      type="checkbox"
                      checked={plugin.visible}
                      onChange={() => handleToggleVisibility(index)}
                    />
                    <label htmlFor={`visible-${plugin.id}`}>Visible</label>
                  </div>
                  {/* Future: Settings and Drag handle */}
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" loading={saving}>
            Save Layout
          </Button>
        </form>

        {status && (
          <div className={`${styles.status} ${status.type === 'success' ? styles.success : styles.error}`}>
            {status.message}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PDPManager;
