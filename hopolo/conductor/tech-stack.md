# Technology Stack: HYPVZN

## Core Development
- **Language:** TypeScript
- **Frontend Framework:** React (Vite)
- **State Management (Real-time):** Firebase Firestore (specifically for Cart synchronization)

## Backend & Persistence
- **Authentication:** Firebase Auth (Phone Number/OTP & Anonymous Sign-in for Guest Carts)
- **ORM:** Prisma
- **Database:** SQLite (development) / PostgreSQL (production)

## Third-Party Integrations
- **Payments:** Razorpay Checkout & Webhooks
- **Shipping:** Shadowfax API
- **Email:** Resend / SendGrid

## Infrastructure
- **Hosting:** Vercel

## UI & Styling
- **Styling Engine:** CSS Modules
- **Notifications:** Custom Toast system for real-time feedback
- **Icons:** Lucide React
- **Design System:** Ethos Archetype (Custom CSS-variable system)
- **Extensibility:** Plugin-based architecture for dynamic page rendering (Registry + Renderer), supporting modular layouts for Home and PDP.
- **Testing:** Vitest + React Testing Library
