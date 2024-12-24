// types/blog.ts
export interface BlogPost {
    id: string;
    title: string;
    description?: string;
    content: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
    published: boolean;
    featured?: boolean;
    author: {
      id: string;
      name: string;
      image?: string;
    };
    createdAt: Date;
    updatedAt: Date;
    views: number;
  }