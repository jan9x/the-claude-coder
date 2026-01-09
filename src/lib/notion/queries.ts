import { notion, databaseId } from "./client";
import { PostMeta, Post } from "./types";
import {
  PageObjectResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

function getPlainText(richText: { plain_text: string }[]): string {
  return richText.map((t) => t.plain_text).join("");
}

function calculateReadingTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}

function transformPageToPostMeta(page: PageObjectResponse): PostMeta {
  const properties = page.properties;

  // Extract title
  const titleProp = properties["Title"];
  const title =
    titleProp?.type === "title" ? getPlainText(titleProp.title) : "Untitled";

  // Extract slug
  const slugProp = properties["Slug"];
  const slug =
    slugProp?.type === "rich_text" ? getPlainText(slugProp.rich_text) : page.id;

  // Extract meta description as excerpt
  const excerptProp = properties["Meta Description"];
  const excerpt =
    excerptProp?.type === "rich_text"
      ? getPlainText(excerptProp.rich_text)
      : "";

  // Extract cover image
  const coverProp = properties["Featured Image"];
  let coverImage: string | null = null;
  if (coverProp?.type === "files" && coverProp.files.length > 0) {
    const file = coverProp.files[0];
    if (file.type === "file") {
      coverImage = file.file.url;
    } else if (file.type === "external") {
      coverImage = file.external.url;
    }
  }

  // Extract publish date
  const dateProp = properties["Publish Date"];
  const publishedDate =
    dateProp?.type === "date" && dateProp.date
      ? dateProp.date.start
      : new Date().toISOString().split("T")[0];

  // Extract category
  const categoryProp = properties["Category"];
  const category =
    categoryProp?.type === "select" && categoryProp.select
      ? categoryProp.select.name
      : "Uncategorized";

  // Extract tags
  const tagsProp = properties["Tags"];
  const tags =
    tagsProp?.type === "multi_select"
      ? tagsProp.multi_select.map((t) => t.name)
      : [];

  // Extract word count for reading time
  const wordCountProp = properties["Word Count"];
  const wordCount =
    wordCountProp?.type === "number" && wordCountProp.number
      ? wordCountProp.number
      : 1000;

  return {
    id: page.id,
    title,
    slug,
    excerpt,
    coverImage,
    publishedDate,
    category,
    tags,
    readingTime: calculateReadingTime(wordCount),
  };
}

export async function getPublishedPosts(): Promise<PostMeta[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      or: [
        {
          property: "Status",
          status: {
            equals: "Ready",
          },
        },
        {
          property: "Status",
          status: {
            equals: "Published",
          },
        },
      ],
    },
    sorts: [
      {
        property: "Publish Date",
        direction: "descending",
      },
    ],
  });

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map(transformPageToPostMeta);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: "Slug",
          rich_text: {
            equals: slug,
          },
        },
        {
          or: [
            {
              property: "Status",
              status: {
                equals: "Ready",
              },
            },
            {
              property: "Status",
              status: {
                equals: "Published",
              },
            },
          ],
        },
      ],
    },
  });

  if (response.results.length === 0) {
    return null;
  }

  const page = response.results[0] as PageObjectResponse;
  const meta = transformPageToPostMeta(page);
  const properties = page.properties;

  // Get author info
  const authorProp = properties["Author"];
  let author = { name: "Anonymous", avatar: null as string | null };
  if (authorProp?.type === "people" && authorProp.people.length > 0) {
    const person = authorProp.people[0];
    if ("name" in person) {
      author = {
        name: person.name || "Anonymous",
        avatar: person.avatar_url || null,
      };
    }
  }

  // Get status
  const statusProp = properties["Status"];
  const status =
    statusProp?.type === "status" && statusProp.status
      ? statusProp.status.name
      : "Draft";

  // Get word count
  const wordCountProp = properties["Word Count"];
  const wordCount =
    wordCountProp?.type === "number" && wordCountProp.number
      ? wordCountProp.number
      : 1000;

  // Fetch page content blocks
  const blocks = await getPageBlocks(page.id);
  const content = JSON.stringify(blocks);

  return {
    ...meta,
    content,
    author,
    wordCount,
    status,
  };
}

export async function getPageBlocks(
  pageId: string
): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const block of response.results) {
      if ("type" in block) {
        blocks.push(block as BlockObjectResponse);

        // Fetch children for blocks that can have them
        if (block.has_children) {
          const children = await getPageBlocks(block.id);
          (block as BlockObjectResponse & { children?: BlockObjectResponse[] }).children = children;
        }
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return blocks;
}

export async function getReadyPostIds(): Promise<string[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Status",
      status: {
        equals: "Ready",
      },
    },
  });

  return response.results.map((page) => page.id);
}

export async function updatePostStatus(
  pageId: string,
  status: string
): Promise<void> {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Status: {
        status: {
          name: status,
        },
      },
    },
  });
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const tagSet = new Set<string>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const categorySet = new Set<string>();

  for (const post of posts) {
    categorySet.add(post.category);
  }

  return Array.from(categorySet).sort();
}
