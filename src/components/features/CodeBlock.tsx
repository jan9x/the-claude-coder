import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language: string;
}

export async function CodeBlock({ code, language }: CodeBlockProps) {
  // Map Notion language names to Shiki language names
  const languageMap: Record<string, string> = {
    "plain text": "text",
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    java: "java",
    "c++": "cpp",
    "c#": "csharp",
    go: "go",
    rust: "rust",
    ruby: "ruby",
    php: "php",
    swift: "swift",
    kotlin: "kotlin",
    scala: "scala",
    html: "html",
    css: "css",
    scss: "scss",
    json: "json",
    yaml: "yaml",
    xml: "xml",
    markdown: "markdown",
    bash: "bash",
    shell: "shell",
    sql: "sql",
    graphql: "graphql",
    dockerfile: "dockerfile",
  };

  const mappedLanguage = languageMap[language.toLowerCase()] || "text";

  const html = await codeToHtml(code, {
    lang: mappedLanguage,
    theme: "github-light",
  });

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-neutral-200">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 border-b border-neutral-200">
        <span className="text-xs font-medium text-neutral-500 uppercase">
          {language}
        </span>
      </div>
      <div
        className="overflow-x-auto [&>pre]:p-4 [&>pre]:m-0 [&>pre]:bg-white"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
