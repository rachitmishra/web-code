# Plugin System Documentation

Hopolo uses a plugin-based architecture for its Product Detail Page (PDP), allowing for dynamic layouts manageable via the Admin Panel.

## Architecture

- **Registry:** `src/plugins/registry.ts` manages all available plugins.
- **Renderer:** `src/plugins/PluginRenderer.tsx` dynamically renders visible plugins based on a configuration fetched from Firestore.
- **Storage:** Layout configurations are stored in the `settings/pdp_layout` document in Firestore.

## Adding a New Plugin

1. **Create Component:** Create a new directory in `src/plugins/pdp/` (e.g., `MyNewPlugin/`).
2. **Implement Plugin:** Create your React component. Plugins receive `pluginProps` (shared page data) and `config` (plugin-specific settings).
3. **Register:** Add your plugin to `src/plugins/registry.ts`:
   ```typescript
   import MyNewPlugin from './pdp/MyNewPlugin/MyNewPlugin';
   
   registerPlugin('MyNewPlugin', MyNewPlugin, {
     id: 'MyNewPlugin',
     name: 'My New Feature',
     description: 'Describe what it does.'
   });
   ```
4. **Update Default Layout (Optional):** If you want it to appear by default, update `DEFAULT_PDP_LAYOUT` in `src/services/storefrontService.ts`.

## Admin Configuration

Admins can manage plugins at `/admin/pdp`:
- **Visibility:** Toggle whether a plugin is rendered.
- **Ordering:** Use "Move Up" or "Move Down" to change the vertical stack.
