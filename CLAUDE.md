# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Claude Coder is a blog website built with Next.js 14 that uses Notion as its CMS. Content is authored in Notion and synced to the site during builds. The site is deployed on Vercel with ISR (1-hour revalidation).

**Live site**: https://the-claude-coder.vercel.app

## Commands

```bash
npm run dev              # Start development server
npm run build            # Build and update Notion status (Ready → Published)
npm run build:no-update  # Build without updating Notion status
npm run lint             # Run ESLint
npx vercel --prod        # Deploy to production
```

## Slash Commands

- `/refresh` - Trigger a Vercel deployment to sync latest Notion content

## Architecture

### Content Flow

```
Notion Database (Status: Ready/Published)
    ↓
src/lib/notion/queries.ts (fetches posts)
    ↓
Next.js builds static pages (SSG with ISR)
    ↓
scripts/update-notion-status.mjs (Ready → Published)
    ↓
Vercel deployment
```

### Notion Integration (`src/lib/notion/`)

- **client.ts** - Notion API client initialization
- **queries.ts** - Database queries (`getPublishedPosts`, `getPostBySlug`, `getPageBlocks`)
- **renderer.tsx** - Converts Notion blocks to React components with Shiki syntax highlighting
- **types.ts** - TypeScript interfaces for `Post` and `PostMeta`

The site fetches articles with Status = "Ready" or "Published". After a successful build, the post-build script updates all "Ready" articles to "Published".

### Notion Database Schema

| Property | Type | Purpose |
|----------|------|---------|
| Title | title | Post title |
| Slug | rich_text | URL path |
| Status | status | Draft → Writing → In Review → Revisions → Ready → Published |
| Category | select | Post category |
| Tags | multi_select | Post tags |
| Featured Image | files | Cover image |
| Publish Date | date | Publication date |
| Meta Title/Description | rich_text | SEO metadata |
| Author | people | Post author |
| Word Count | number | For reading time calculation |

### Key Patterns

- Pages use `revalidate = 3600` for 1-hour ISR
- `generateStaticParams` pre-renders all published post slugs
- Newsletter signups are stored in `data/newsletter.csv`
- Tailwind v4 with CSS-based theme configuration in `globals.css`
- Anthropic orange (#FF6B35) is the primary accent color

## Environment Variables

Required in `.env.local` and Vercel:
- `NOTION_API_KEY` - Notion integration token
- `NOTION_DATABASE_ID` - Notion database ID
- `SITE_URL` - Site URL for metadata
