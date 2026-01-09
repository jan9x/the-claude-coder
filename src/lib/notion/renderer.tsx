import { BlockObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { Fragment } from "react";
import { CodeBlock } from "@/components/features/CodeBlock";
import Image from "next/image";

type BlockWithChildren = BlockObjectResponse & {
  children?: BlockObjectResponse[];
};

function renderRichText(richText: RichTextItemResponse[]): React.ReactNode {
  return richText.map((text, index) => {
    if (text.type !== "text") {
      return <Fragment key={index}>{text.plain_text}</Fragment>;
    }

    let content: React.ReactNode = text.text.content;

    if (text.annotations.bold) {
      content = <strong key={`bold-${index}`}>{content}</strong>;
    }
    if (text.annotations.italic) {
      content = <em key={`italic-${index}`}>{content}</em>;
    }
    if (text.annotations.strikethrough) {
      content = <s key={`strike-${index}`}>{content}</s>;
    }
    if (text.annotations.underline) {
      content = <u key={`underline-${index}`}>{content}</u>;
    }
    if (text.annotations.code) {
      content = <code key={`code-${index}`}>{content}</code>;
    }

    if (text.text.link) {
      content = (
        <a
          key={`link-${index}`}
          href={text.text.link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }

    return <Fragment key={index}>{content}</Fragment>;
  });
}

function renderBlock(block: BlockWithChildren): React.ReactNode {
  const { type, id } = block;

  switch (type) {
    case "paragraph":
      if (block.paragraph.rich_text.length === 0) {
        return <p key={id}>&nbsp;</p>;
      }
      return <p key={id}>{renderRichText(block.paragraph.rich_text)}</p>;

    case "heading_1":
      return (
        <h1 key={id}>{renderRichText(block.heading_1.rich_text)}</h1>
      );

    case "heading_2":
      return (
        <h2 key={id}>{renderRichText(block.heading_2.rich_text)}</h2>
      );

    case "heading_3":
      return (
        <h3 key={id}>{renderRichText(block.heading_3.rich_text)}</h3>
      );

    case "bulleted_list_item":
      return (
        <li key={id}>
          {renderRichText(block.bulleted_list_item.rich_text)}
          {block.children && block.children.length > 0 && (
            <ul>{block.children.map(renderBlock)}</ul>
          )}
        </li>
      );

    case "numbered_list_item":
      return (
        <li key={id}>
          {renderRichText(block.numbered_list_item.rich_text)}
          {block.children && block.children.length > 0 && (
            <ol>{block.children.map(renderBlock)}</ol>
          )}
        </li>
      );

    case "to_do":
      return (
        <div key={id} className="flex items-start gap-2 my-1">
          <input
            type="checkbox"
            checked={block.to_do.checked}
            readOnly
            className="mt-1.5"
          />
          <span className={block.to_do.checked ? "line-through text-neutral-500" : ""}>
            {renderRichText(block.to_do.rich_text)}
          </span>
        </div>
      );

    case "toggle":
      return (
        <details key={id} className="my-2">
          <summary className="cursor-pointer font-medium">
            {renderRichText(block.toggle.rich_text)}
          </summary>
          <div className="pl-4 mt-2">
            {block.children?.map(renderBlock)}
          </div>
        </details>
      );

    case "code":
      const code = block.code.rich_text.map((t) => t.plain_text).join("");
      const language = block.code.language || "text";
      return <CodeBlock key={id} code={code} language={language} />;

    case "image":
      const imageUrl =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      const caption =
        block.image.caption.length > 0
          ? block.image.caption.map((c) => c.plain_text).join("")
          : "";
      return (
        <figure key={id} className="my-8">
          <div className="relative w-full aspect-video">
            <Image
              src={imageUrl}
              alt={caption || "Blog image"}
              fill
              className="object-contain rounded-xl"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {caption && (
            <figcaption className="text-center text-sm text-neutral-500 mt-2">
              {caption}
            </figcaption>
          )}
        </figure>
      );

    case "video":
      const videoUrl =
        block.video.type === "external"
          ? block.video.external.url
          : block.video.file.url;
      return (
        <div key={id} className="my-8 aspect-video">
          <iframe
            src={videoUrl}
            className="w-full h-full rounded-xl"
            allowFullScreen
          />
        </div>
      );

    case "quote":
      return (
        <blockquote key={id}>
          {renderRichText(block.quote.rich_text)}
        </blockquote>
      );

    case "callout":
      const icon = block.callout.icon;
      const emoji = icon?.type === "emoji" ? icon.emoji : "💡";
      return (
        <div
          key={id}
          className="flex gap-3 p-4 my-4 bg-neutral-100 rounded-xl"
        >
          <span className="text-xl">{emoji}</span>
          <div>{renderRichText(block.callout.rich_text)}</div>
        </div>
      );

    case "divider":
      return <hr key={id} />;

    case "bookmark":
      const bookmarkUrl = block.bookmark.url;
      return (
        <a
          key={id}
          href={bookmarkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 my-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
        >
          <span className="text-primary-500 break-all">{bookmarkUrl}</span>
        </a>
      );

    case "embed":
      return (
        <div key={id} className="my-8 aspect-video">
          <iframe
            src={block.embed.url}
            className="w-full h-full rounded-xl border-0"
            allowFullScreen
          />
        </div>
      );

    case "table":
      return (
        <div key={id} className="my-6 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <tbody>
              {block.children?.map((row, rowIndex) => {
                if (row.type !== "table_row") return null;
                return (
                  <tr key={row.id}>
                    {row.table_row.cells.map((cell, cellIndex) => {
                      const CellTag =
                        block.table.has_column_header && rowIndex === 0
                          ? "th"
                          : "td";
                      return (
                        <CellTag
                          key={cellIndex}
                          className="border border-neutral-200 px-4 py-2"
                        >
                          {renderRichText(cell)}
                        </CellTag>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

interface NotionRendererProps {
  blocks: BlockObjectResponse[];
}

export function NotionRenderer({ blocks }: NotionRendererProps) {
  // Group consecutive list items
  const groupedBlocks: (BlockWithChildren | BlockWithChildren[])[] = [];
  let currentList: BlockWithChildren[] = [];
  let currentListType: "bulleted" | "numbered" | null = null;

  for (const block of blocks as BlockWithChildren[]) {
    if (block.type === "bulleted_list_item") {
      if (currentListType === "bulleted") {
        currentList.push(block);
      } else {
        if (currentList.length > 0) {
          groupedBlocks.push(currentList);
        }
        currentList = [block];
        currentListType = "bulleted";
      }
    } else if (block.type === "numbered_list_item") {
      if (currentListType === "numbered") {
        currentList.push(block);
      } else {
        if (currentList.length > 0) {
          groupedBlocks.push(currentList);
        }
        currentList = [block];
        currentListType = "numbered";
      }
    } else {
      if (currentList.length > 0) {
        groupedBlocks.push(currentList);
        currentList = [];
        currentListType = null;
      }
      groupedBlocks.push(block);
    }
  }

  if (currentList.length > 0) {
    groupedBlocks.push(currentList);
  }

  return (
    <div className="prose">
      {groupedBlocks.map((item, index) => {
        if (Array.isArray(item)) {
          const listType = item[0].type;
          if (listType === "bulleted_list_item") {
            return <ul key={index}>{item.map(renderBlock)}</ul>;
          } else {
            return <ol key={index}>{item.map(renderBlock)}</ol>;
          }
        }
        return renderBlock(item);
      })}
    </div>
  );
}
