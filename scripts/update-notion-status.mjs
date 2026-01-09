#!/usr/bin/env node

/**
 * Post-build script to update Notion page status from "Ready" to "Published"
 *
 * This script runs after the Next.js build completes and updates all articles
 * with Status = "Ready" to Status = "Published" in the Notion database.
 */

import { Client } from "@notionhq/client";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY) {
  console.error("Error: NOTION_API_KEY environment variable is not set");
  process.exit(1);
}

if (!NOTION_DATABASE_ID) {
  console.error("Error: NOTION_DATABASE_ID environment variable is not set");
  process.exit(1);
}

const notion = new Client({
  auth: NOTION_API_KEY,
});

async function getReadyPosts() {
  const response = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
    filter: {
      property: "Status",
      status: {
        equals: "Ready",
      },
    },
  });

  return response.results;
}

async function updatePostStatus(pageId, title) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Status: {
          status: {
            name: "Published",
          },
        },
      },
    });
    console.log(`  Updated: "${title}"`);
    return true;
  } catch (error) {
    console.error(`  Failed to update "${title}":`, error.message);
    return false;
  }
}

async function main() {
  console.log("\n📝 Post-Build: Updating Notion Status\n");
  console.log("Fetching articles with Status = 'Ready'...\n");

  try {
    const readyPosts = await getReadyPosts();

    if (readyPosts.length === 0) {
      console.log("No articles found with Status = 'Ready'");
      console.log("\n✅ Post-build complete!\n");
      return;
    }

    console.log(`Found ${readyPosts.length} article(s) to update:\n`);

    let successCount = 0;
    let failCount = 0;

    for (const post of readyPosts) {
      const title = post.properties?.Title?.title?.[0]?.plain_text || "Untitled";
      const success = await updatePostStatus(post.id, title);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log(`\nResults: ${successCount} updated, ${failCount} failed`);
    console.log("\n✅ Post-build complete!\n");
  } catch (error) {
    console.error("Error during post-build:", error.message);
    process.exit(1);
  }
}

main();
