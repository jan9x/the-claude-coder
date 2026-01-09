export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  publishedDate: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string | null;
  };
  wordCount: number;
  readingTime: number;
  status: string;
}

export interface PostMeta {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  publishedDate: string;
  category: string;
  tags: string[];
  readingTime: number;
}
