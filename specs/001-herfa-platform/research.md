# Research: Herfa Platform Implementation

## Decision: NestJS for Backend
- **Decision**: Use NestJS for the backend API.
- **Rationale**: Provides a highly structured, modular architecture out-of-the-box which aligns with the Constitution's "Clean Architecture" mandate.
- **Alternatives considered**: Express (too minimal, harder to enforce standards), Fastify (fast but less "batteries-included" than Nest for enterprise).

## Decision: Turborepo for Monorepo Management
- **Decision**: Use Turborepo.
- **Rationale**: Industry standard for 2026, high performance, and great integration with Next.js and shared TypeScript packages.
- **Alternatives considered**: Lerna (older, slower), Nx (powerful but steeper learning curve than needed).

## Decision: MongoDB for Primary Database
- **Decision**: MongoDB.
- **Rationale**: Flexible schema is ideal for service marketplaces where service details (plumbing vs. cleaning) can vary significantly. Horizontal scaling via sharding is well-understood for millions of users.
- **Alternatives considered**: PostgreSQL (great for relational data, but JSONB performance and scaling at this specific "million user" mobile-first scope makes Mongo a strong choice for the service request entity).

## Decision: Socket.IO for Real-time
- **Decision**: Socket.IO.
- **Rationale**: Mature, supports rooms (booking IDs), and provides excellent fallback mechanisms.
- **Alternatives considered**: WebSockets (too low-level), Ably/Pusher (great but increases external costs significantly).

## Best Practices for Mobile-First i18n (Arabic/English)
- Use `react-i18next` with `i18next-browser-languagedetector`.
- For RTL layout, use Logical Properties (`margin-inline-start` instead of `margin-left`).
- Dynamic font loading to handle different scripts efficiently.
- Ensure all SVG icons are mirrored where appropriate.
