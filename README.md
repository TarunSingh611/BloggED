# Blogged - Modern Blog Platform

A modern blog platform built with Next.js, Prisma, and Tailwind CSS. Features a beautiful dashboard for content management, user authentication, and a responsive blog frontend.

## Features

- ✨ **Modern Design** - Beautiful, responsive design with dark mode support
- 📝 **Rich Content Editor** - Create and edit posts with HTML formatting
- 🔐 **User Authentication** - Secure login with NextAuth.js
- 📊 **Dashboard** - Manage all your posts from a central dashboard
- 🎨 **Customizable** - Easy to customize with Tailwind CSS
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Fast Performance** - Built with Next.js for optimal performance

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blogged
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Shared CMS database
   DATABASE_URL="mongodb://localhost:27017/ai-content-platform"

   # This blog's URL
   NEXTAUTH_URL="http://localhost:3001"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Optional demo creds to auto-fill sign-in form (non-sensitive; UI only)
   NEXT_PUBLIC_DEMO_EMAIL=""
   NEXT_PUBLIC_DEMO_PASSWORD=""

   # Optional media/CDN
   IMAGEKIT_URL=""

   # Optional: point this app to a different API base (defaults to same origin)
   NEXT_PUBLIC_API_BASE_URL=""

   # CMS URL for authoring (used for redirects from CTA and dashboard buttons)
   NEXT_PUBLIC_CMS_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database with demo data**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   # Run on a separate port from the CMS so both can run together
   cross-env PORT=3001 npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials

After running the seed script, you can sign in with:
- **Email:** admin@example.com
- **Password:** password

## Dashboard Features

### View Posts
- Click on any post in the dashboard to view it
- Use the "View" button to see the published version
- Filter posts by status (All, Published, Drafts)

### Authoring
Authoring happens in the CMS. This blog is read-only.
- Homepage “Write Your Story” and Dashboard “Create New Post” redirect to `NEXT_PUBLIC_CMS_URL`.
- Edit/Delete actions are disabled in this blog app.

### Edit Posts
- Click "Edit" on any post in the dashboard
- Modify all post details
- Preview changes before saving
- Delete posts with confirmation

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions
└── type/                  # TypeScript types
```

## Technologies Used

- **Next.js 14** - React framework
- **Prisma** - Database ORM
- **MongoDB** - Database
- **NextAuth.js** - Authentication
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **TypeScript** - Type safety

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
