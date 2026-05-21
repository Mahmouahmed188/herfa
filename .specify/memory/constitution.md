<!--
Version change: 0.1.0 -> 1.0.0
List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Scalability & Clean Architecture
  - [PRINCIPLE_2_NAME] -> II. Security-First & Zero Trust
  - [PRINCIPLE_3_NAME] -> III. Mobile-First & Cross-Platform Parity
  - [PRINCIPLE_4_NAME] -> IV. Multilingual & Internationalization
  - [PRINCIPLE_5_NAME] -> V. Type-Safe Development & Validation
Added sections:
  - VI. Observability & Monitoring
  - VII. SOLID Principles Enforcement
  - Technical Standards (Frontend, Backend, Mobile, API, Database, Security)
  - Development Lifecycle (Git, Testing, CI/CD, Documentation)
Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated)
  - .specify/templates/spec-template.md (✅ updated)
  - .specify/templates/tasks-template.md (✅ updated)
Follow-up TODOs: None
-->
# Herfa Constitution
The foundational governance document for the Herfa multi-platform service marketplace.

## Core Principles

### I. Scalability & Clean Architecture
The system MUST be designed for horizontal scalability and maintainability. We enforce Clean Architecture patterns to decouple business logic from external frameworks. Every feature MUST follow the Domain-Driven Design (DDD) recommendations, ensuring that core business rules are isolated in the domain layer. Monorepo structures SHOULD be utilized to share types and logic between Web, Mobile, and Backend.

### II. Security-First & Zero Trust
Security is non-negotiable. Every request MUST be authenticated via JWT with Refresh Token rotation. We follow Zero Trust principles: never trust, always verify. All PII (Personally Identifiable Information) MUST be encrypted at rest. Strict Zod-based validation is mandatory for all inputs (API, Form, State) to prevent injection and data corruption.

### III. Mobile-First & Cross-Platform Parity
Herfa is a mobile-centric application. UX/UI design MUST prioritize mobile interactions while maintaining parity on the Web. The React Native application and Next.js web app MUST share a consistent design language and business logic where possible. Responsive design is mandatory for all web components.

### IV. Multilingual & Internationalization
Herfa MUST provide full parity between Arabic (RTL) and English (LTR) languages. Internationalization (i18n) MUST be baked into the component level. RTL support is a first-class citizen, not an afterthought. Layouts MUST be fluid to handle varying text lengths across languages.

### V. Type-Safe Development & Validation
Strict TypeScript (v5+) is mandatory across the entire stack. `any` is forbidden. Every API response, database model, and component prop MUST be explicitly typed. We use Zod for runtime validation to ensure that types reflect reality.

### VI. Observability & Monitoring
Every production service MUST be observable. Structured logging (Pino/Winston) is required. Real-time monitoring of system health, API latency, and error rates MUST be implemented. Every error MUST be caught, logged with context, and reported to a centralized error tracking system (e.g., Sentry).

### VII. SOLID Principles Enforcement
All code MUST adhere to SOLID principles. We prioritize composition over inheritance. Small, single-responsibility modules are the building blocks of our system. Interface segregation ensures that components and services only depend on the abstractions they actually use.

## Technical Standards

### Frontend & Mobile
- **Frameworks**: Next.js 14+ (Web), React Native (Mobile).
- **State Management**: Zustand for global state, React Query for server state.
- **Styling**: Vanilla CSS or Tailwind CSS (only if requested), prioritizing CSS variables for theming.
- **Components**: Reusable, atomic component strategy. Documentation via Storybook is RECOMMENDED.

### Backend & API
- **Framework**: NestJS with modular architecture.
- **API Design**: RESTful standards, versioned endpoints (`/v1/...`).
- **Response Structure**: Unified response format: `{ success: boolean, data: any, error?: { code: string, message: string } }`.
- **Real-time**: Socket.IO for live chat and tracking.

### Database & Storage
- **Database**: MongoDB (Mongoose).
- **Modeling**: Schema-first approach with strict validation.
- **File Storage**: Cloudinary for optimized image/video delivery.

## Development Workflow

### Git & Commit Conventions
- **Workflow**: Trunk-based development with short-lived feature branches.
- **Commits**: Conventional Commits standard (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- **Quality**: PRs MUST pass linting, type-checking, and unit tests before merging.

### Testing Strategy
- **Unit**: Mandatory for business logic and utilities.
- **Integration**: Mandatory for API endpoints and database interactions.
- **E2E**: Critical paths (Booking, Payment, Auth) MUST be covered by E2E tests.

## Governance
This Constitution is the supreme authority for engineering decisions at Herfa. Amendments require a formal proposal, review by the core team, and a version bump. Compliance is verified during code reviews and automated CI gates.

**Version**: 1.0.0 | **Ratified**: 2026-05-21 | **Last Amended**: 2026-05-21
