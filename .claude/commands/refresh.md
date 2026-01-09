# Refresh Website

Trigger a new Vercel production deployment to sync the latest content from Notion.

## What this does:
1. Deploys the site to Vercel production
2. Fetches all articles with Status = "Ready" or "Published" from Notion
3. Updates any "Ready" articles to "Published" status
4. Clears the ISR cache so changes appear immediately

## Instructions

Run the following command to trigger a production deployment:

```bash
cd /Users/mycorner/Projects/Notion\ AI\ Blog/the-claude-coder && npx vercel --prod
```

After deployment completes, provide the user with:
- The live site URL: https://the-claude-coder.vercel.app
- Confirmation of how many articles were updated (from the build logs)
- Any errors if the deployment failed
