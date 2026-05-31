# Specification: Plugin-Based Product Detail Page (PDP)

## Overview
Transform the Product Detail Page (PDP) into a flexible, plugin-based architecture. Each functional block of the PDP (e.g., Image Gallery, Product Info, Reviews, Related Products) will become an independent "plugin." These plugins will be manageable via the Admin Panel, allowing admins to reorder sections, toggle visibility, and configure specific instance settings.

## Functional Requirements
- **Plugin Architecture:** 
  - Create a dedicated `src/plugins/` directory.
  - Each plugin must be a self-contained React component.
  - Implement a dynamic `PluginRegistry` to map unique identifiers to plugin components.
- **Decentralized Data Fetching:**
  - Plugins should be responsible for their own data fetching or state management where applicable, reducing dependence on the parent page loader.
- **Admin Panel Control:**
  - **Layout Manager:** A new interface in the Admin Panel specifically for the PDP.
  - **Drag & Drop:** Ability to rearrange the vertical order of plugins.
  - **Visibility Toggles:** Enable or disable specific plugins for the live site.
  - **Instance Configuration:** A UI to edit plugin-specific parameters (e.g., 'show quantity selector' or 'number of related products').
- **Persistence:**
  - Store the PDP layout configuration (order, visibility, settings) in Firestore.
- **Dynamic Rendering:**
  - The PDP route will fetch the layout configuration and render the registered plugins accordingly.

## Non-Functional Requirements
- **Performance:** Dynamic loading should not significantly impact page load times.
- **Scalability:** The system should be designed to easily accommodate new plugins in the future (and potentially expand to the Home page).

## Acceptance Criteria
- [ ] Admins can reorder PDP sections via drag-and-drop in the Admin Panel.
- [ ] Changes made in the Admin Panel are reflected on the live PDP after saving.
- [ ] Plugins can be toggled on/off without breaking the page layout.
- [ ] Each plugin correctly fetches and displays its own required data.
- [ ] A new plugin can be added to the registry and appear in the Admin layout manager.

## Out of Scope
- Implementing this system for pages other than the PDP (e.g., Home, Cart) in this initial track.
- Real-time "Live Preview" of layout changes (saving first is acceptable).
