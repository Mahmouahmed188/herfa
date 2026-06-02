# Herfa Admin Dashboard

The operational control center for the Herfa service marketplace platform.

## Engineering Standards

This project is governed by the [Herfa Admin Dashboard Constitution](.specify/memory/constitution.md). All contributions MUST adhere to the core principles:

1. **Feature-Based Architecture**: Strict modularity by feature.
2. **Zero-Trust & Permission-Based UI**: Dynamic RBAC-driven interface.
3. **Type-Safe Enterprise Excellence**: Strict TypeScript + Zod validation.
4. **Server-State Dominance**: TanStack Query for data fetching.
5. **Consistent Design Language**: Radix UI + Tailwind CSS.
6. **Observable Admin Operations**: Traceable actions and error monitoring.
7. **Universal Accessibility & I18n**: WCAG 2.2 AA + Full RTL/LTR parity.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
