# Blog Site Integration Guide

This document provides comprehensive information for blog sites that need to integrate with the AI Content Platform CMS. This CMS serves as a centralized content management system that multiple blog sites can connect to for content and data.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Blog Site 1   │    │   Blog Site 2   │    │   Blog Site N   │
│                 │    │                 │    │                 │
│ - Frontend      │    │ - Frontend      │    │ - Frontend      │
│ - API Calls     │    │ - API Calls     │    │ - API Calls     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   AI Content    │
                    │   Platform CMS  │
                    │                 │
                    │ - Content API   │
                    │ - User Auth     │
                    │ - Media Storage │
                    │ - Analytics     │
                    └─────────────────┘
```

## 📊 Database Schema

### Core Models

#### User Model
```typescript
interface User {
  id: string;              // MongoDB ObjectId
  name: string;            // User's display name
  email: string;           // Unique email
  password?: string;       // Hashed password
  image?: string;          // Profile image URL
  websiteUrl?: string;     // URL to the connected blog/site
  bio?: string;           // User bio
  createdAt: Date;
  updatedAt: Date;
  role: 'USER' | 'ADMIN';
  contents: Content[];     // User's content
  media: Media[];         // User's media files
}
```

#### Content Model
```typescript
interface Content {
  id: string;              // MongoDB ObjectId
  title: string;           // Content title
  description?: string;    // Content description
  content: string;         // Main content (HTML/Markdown)
  excerpt?: string;        // Short excerpt
  coverImage?: string;     // Featured image URL
  published: boolean;      // Publication status
  featured?: boolean;      // Featured content flag
  authorId: string;        // Author's user ID
  author: User;           // Author details
  tags: string[];         // Content tags
  seoTitle?: string;      // SEO title
  seoDescription?: string; // SEO description
  seoKeywords: string[];  // SEO keywords
  slug?: string;          // URL slug
  views: number;          // View count
  likes: number;          // Like count
  shares: number;         // Share count
  comments: number;       // Comment count
  readingTime?: number;   // Reading time in minutes
  createdAt: Date;
  updatedAt: Date;
}
```

#### Media Model
```typescript
interface Media {
  id: string;              // MongoDB ObjectId
  title: string;           // Media title
  type: string;           // 'image', 'video', 'document'
  url: string;            // Media URL
  thumbnail?: string;     // Thumbnail URL
  size: number;           // File size in bytes
  format: string;         // File format
  width?: number;         // Image/video width
  height?: number;        // Image/video height
  userId: string;         // Owner's user ID
  user: User;            // Owner details
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔌 API Endpoints

### Base URL
```
https://your-cms-domain.com/api
```

### Authentication
All API calls require authentication. Include the session token in your requests.

### Content Endpoints

#### Get All Content
```http
GET /api/content
Authorization: Bearer <session-token>
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Sample Blog Post",
    "description": "This is a sample blog post",
    "content": "<p>Your HTML content here...</p>",
    "excerpt": "Short excerpt...",
    "coverImage": "https://example.com/image.jpg",
    "published": true,
    "featured": false,
    "tags": ["technology", "ai"],
    "seoTitle": "SEO Optimized Title",
    "seoDescription": "SEO description",
    "seoKeywords": ["keyword1", "keyword2"],
    "slug": "sample-blog-post",
    "views": 150,
    "likes": 25,
    "shares": 10,
    "comments": 5,
    "readingTime": 5,
    "author": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Single Content
```http
GET /api/content/{id}
Authorization: Bearer <session-token>
```

#### Create Content
```http
POST /api/content
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "title": "New Blog Post",
  "content": "<p>Your content here...</p>",
  "description": "Description",
  "excerpt": "Short excerpt",
  "coverImage": "https://example.com/image.jpg",
  "tags": ["tag1", "tag2"],
  "published": true,
  "featured": false,
  "seoTitle": "SEO Title",
  "seoDescription": "SEO Description",
  "seoKeywords": ["keyword1", "keyword2"]
}
```

#### Update Content
```http
PUT /api/content/{id}
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  // ... other fields
}
```

#### Delete Content
```http
DELETE /api/content/{id}
Authorization: Bearer <session-token>
```

### Media Endpoints

#### Get All Media
```http
GET /api/media
Authorization: Bearer <session-token>
```

#### Upload Media
```http
POST /api/media
Authorization: Bearer <session-token>
Content-Type: multipart/form-data

// Form data with file upload
```

### Analytics Endpoints

#### Get Analytics Overview
```http
GET /api/analytics
Authorization: Bearer <session-token>
```

**Response:**
```json
{
  "overview": {
    "totalViews": 15000,
    "totalLikes": 2500,
    "totalShares": 800,
    "totalComments": 450,
    "growthRate": 15.5
  },
  "contentPerformance": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Sample Post",
      "views": 1500,
      "likes": 250,
      "shares": 80,
      "comments": 45
    }
  ],
  "dailyViews": [
    {
      "date": "2024-01-15",
      "views": 150
    }
  ],
  "topContent": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Top Performing Post",
      "views": 2500
    }
  ],
  "topTags": [
    {
      "tag": "technology",
      "count": 25
    }
  ],
  "engagementTrends": [
    {
      "date": "2024-01-15",
      "engagement": 85.5
    }
  ]
}
```

## 🔐 Authentication

### Session Management
The CMS uses NextAuth.js for authentication. Blog sites need to:

1. **Login to CMS**: Users must authenticate through the CMS
2. **Get Session Token**: Retrieve the session token after login
3. **Include in Requests**: Add the token to all API requests

### Example Authentication Flow
```javascript
// 1. Login to CMS
const loginResponse = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});

// 2. Get session token
const session = await getSession();

// 3. Use in API calls
const contentResponse = await fetch('/api/content', {
  headers: {
    'Authorization': `Bearer ${session.token}`,
    'Content-Type': 'application/json'
  }
});
```

## 📝 Content Management

### Content States
- **Draft**: `published: false` - Content is not publicly visible
- **Published**: `published: true` - Content is publicly visible
- **Featured**: `featured: true` - Content is highlighted

### Content Types
The CMS supports various content types:
- **Blog Posts**: Standard articles with rich text
- **Pages**: Static pages (About, Contact, etc.)
- **Landing Pages**: Marketing pages

### SEO Fields
Each content item includes SEO optimization fields:
- `seoTitle`: Custom title for search engines
- `seoDescription`: Meta description
- `seoKeywords`: Keywords for SEO
- `slug`: URL-friendly identifier

## 🖼️ Media Management

### Supported Media Types
- **Images**: JPG, PNG, GIF, WebP
- **Videos**: MP4, WebM, MOV
- **Documents**: PDF, DOC, DOCX

### Media Storage
Media files are stored in:
- **ImageKit**: For images and videos
- **Firebase Storage**: For documents

### Media URLs
Media URLs follow this pattern:
```
https://ik.imagekit.io/your-account/image-name.jpg
```

## 📊 Analytics & Tracking

### Metrics Tracked
- **Views**: Page view count
- **Likes**: User likes/reactions
- **Shares**: Social media shares
- **Comments**: User comments
- **Reading Time**: Estimated reading duration

### Analytics Data Structure
```typescript
interface Analytics {
  overview: {
    totalViews: number;
    totalLikes: number;
    totalShares: number;
    totalComments: number;
    growthRate: number;
  };
  contentPerformance: ContentPerformance[];
  dailyViews: DailyView[];
  topContent: TopContent[];
  topTags: TopTag[];
  engagementTrends: EngagementTrend[];
}
```

## 🔗 Integration Examples

### React/Next.js Integration
```javascript
// Fetch content for blog
const fetchBlogContent = async () => {
  const response = await fetch('/api/content', {
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const content = await response.json();
  return content.filter(item => item.published);
};

// Display blog post
const BlogPost = ({ content }) => {
  return (
    <article>
      <h1>{content.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content.content }} />
      <div className="meta">
        <span>Views: {content.views}</span>
        <span>Reading time: {content.readingTime} min</span>
      </div>
    </article>
  );
};
```

### WordPress Integration
```php
// WordPress plugin to fetch CMS content
function fetch_cms_content() {
    $response = wp_remote_get('https://your-cms-domain.com/api/content', [
        'headers' => [
            'Authorization' => 'Bearer ' . get_option('cms_session_token'),
            'Content-Type' => 'application/json'
        ]
    ]);
    
    $content = json_decode(wp_remote_retrieve_body($response), true);
    return array_filter($content, function($item) {
        return $item['published'] === true;
    });
}
```

### Static Site Integration
```javascript
// Build script for static sites
const buildStaticSite = async () => {
  const content = await fetchCMSContent();
  
  content.forEach(post => {
    const html = generatePostHTML(post);
    writeFile(`posts/${post.slug}.html`, html);
  });
};
```

## 🚀 Best Practices

### 1. Caching
- Cache content responses for better performance
- Implement cache invalidation when content updates
- Use CDN for media files

### 2. Error Handling
```javascript
const fetchContent = async () => {
  try {
    const response = await fetch('/api/content');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return [];
  }
};
```

### 3. Rate Limiting
- Implement rate limiting for API calls
- Use exponential backoff for retries
- Monitor API usage

### 4. Security
- Always validate session tokens
- Sanitize content before display
- Use HTTPS for all API calls

## 🛠️ Development Setup

### Environment Variables
```env
# CMS Connection
CMS_BASE_URL=https://your-cms-domain.com
CMS_API_KEY=your-api-key
CMS_SESSION_TOKEN=your-session-token

# Database (if direct access needed)
DATABASE_URL=mongodb://localhost:27017/your-database

# Media Storage
IMAGEKIT_URL=https://ik.imagekit.io/your-account
FIREBASE_STORAGE_BUCKET=your-bucket-name
```

### Testing
```javascript
// Test API connectivity
const testConnection = async () => {
  try {
    const response = await fetch('/api/content');
    console.log('CMS connection successful');
    return true;
  } catch (error) {
    console.error('CMS connection failed:', error);
    return false;
  }
};
```

## 📞 Support

For integration support:
- **Documentation**: Check this README first
- **API Issues**: Review the API endpoints section
- **Authentication**: Ensure proper session management
- **Performance**: Implement caching and error handling

## 🔄 Updates & Maintenance

### Content Updates
- Content updates are real-time
- Use webhooks for instant notifications
- Implement polling for regular updates

### API Versioning
- API versioning is handled via URL paths
- Current version: v1 (default)
- Future versions: `/api/v2/...`

### Breaking Changes
- Breaking changes will be announced in advance
- Deprecation warnings will be included in responses
- Migration guides will be provided

---

**Last Updated**: January 2024
**Version**: 1.0.0
**CMS Version**: AI Content Platform v1.0
