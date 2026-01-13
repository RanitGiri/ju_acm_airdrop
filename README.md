# Airdrop App

A modern Next.js application for wallet connections and airdrop participation, built with shadcn/ui components.

## Features

- 🚀 Next.js 16 with App Router
- 💳 Wallet connection using Wagmi
- 🎨 Beautiful UI with shadcn/ui components
- 🌙 Dark/Light theme support
- 📱 Responsive design
- 🔧 TypeScript support

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Run the development server:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework:** Next.js 16
- **Styling:** Tailwind CSS with shadcn/ui
- **Wallet:** Wagmi v3
- **Database:** Prisma with PostgreSQL
- **Language:** TypeScript

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles with Tailwind
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page
│   └── providers.tsx   # Wagmi providers
├── components/         # Reusable components
│   └── ui/            # shadcn/ui components
├── lib/               # Utility functions
│   ├── db.ts          # Database configuration
│   ├── utils.ts       # General utilities
│   └── wagmi.ts       # Wagmi configuration
└── prisma/            # Database schema
    └── schema.prisma
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Prisma Documentation](https://www.prisma.io/docs)
