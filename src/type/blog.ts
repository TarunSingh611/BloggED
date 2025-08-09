// types/blog.ts
export interface BlogPost {
    id: string;
    title: string;
    description?: string;
    content: string;
    slug?: string;
    excerpt?: string;
    coverImage?: string;
    published: boolean;
    featured?: boolean;
    tags?: string[];
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoKeywords?: string[];
    author: {
      id: string;
      name: string;
      image?: string;
    };
    createdAt: Date;
    updatedAt: Date;
    views: number;
    likes?: number;
    shares?: number;
    comments?: number;
    readingTime?: number;
  }