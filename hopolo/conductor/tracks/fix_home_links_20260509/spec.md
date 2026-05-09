# Specification: Fix Home Screen Links

## Overview
This track aims to fix all broken or placeholder links on the homepage of HYPVZN. This includes ensuring that all navigation elements, product cards, footer links, and call-to-action buttons lead to valid, functional pages or sections. Furthermore, any missing target pages must be created, and their content should be manageable via the Admin Panel.

## Functional Requirements
- **Route Mapping**: Map all placeholder links (`href="#"`) to valid internal routes.
- **SPA Navigation**: Ensure all links use React Router's `Link` component or `navigate()` function to prevent full page reloads.
- **Smooth Scroll**: Implement smooth scrolling for any anchor links pointing to sections on the homepage.
- **Page Creation**: Identify and create any missing pages (e.g., Collections, Archive, Stockists, Legal pages, etc.).
- **Admin Configuration**: Extend the Admin Panel to allow boutique owners to configure the content of these newly created pages.
- **Interactive States**: Apply consistent hover, active, and focus styles to all links according to the "Ethos Archetype" design system.

## Non-Functional Requirements
- **Performance**: Page transitions and smooth scrolling should be "instant" and fluid (<100ms response).
- **Consistency**: Maintain the "Technical Luxury" / "Brutalist" aesthetic across all new pages and interactive states.
- **Type Safety**: Use TypeScript for all new page components and route definitions.

## Acceptance Criteria
- All links in the Header navigate to the correct page without a full reload.
- Product cards in all homepage sections navigate to the correct PDP.
- All Footer links lead to valid information or social pages.
- CTA buttons (e.g., "ENTER ARCHIVE") successfully navigate to the intended target.
- Missing pages (e.g., `/archive`, `/legal/privacy`) exist and display content.
- Content for the new pages can be updated through the Admin Panel.
- All links have visual feedback on hover.

## Out of Scope
- Redesigning the homepage layout itself.
- Implementing advanced SEO or analytics for the new pages (standard implementation only).
- Refactoring the entire routing system beyond adding the necessary new routes.
