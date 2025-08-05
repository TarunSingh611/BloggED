// scripts/seed.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
  })

  // Create some demo posts
  const posts = await Promise.all([
    prisma.content.upsert({
      where: { id: 'demo-post-1' },
      update: {},
             create: {
         id: 'demo-post-1',
         title: 'Welcome to Blogged',
         description: 'A modern blog platform built with Next.js and Prisma',
         content: `
           <h2>Welcome to Blogged!</h2>
           <p>This is a modern blog platform built with Next.js, Prisma, and Tailwind CSS. It features:</p>
           <ul>
             <li>Beautiful, responsive design</li>
             <li>Dark mode support</li>
             <li>Rich text editing</li>
             <li>User authentication</li>
             <li>Dashboard for content management</li>
           </ul>
           <h3>Getting Started</h3>
           <p>To create your first post:</p>
           <ol>
             <li>Sign in to the dashboard</li>
             <li>Click "Create New Post"</li>
             <li>Fill in the details and publish</li>
           </ol>
         `,
         excerpt: 'A modern blog platform built with Next.js and Prisma',
         coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
         published: true,
         featured: true,
         views: 42,
         authorId: user.id,
       },
    }),
    prisma.content.upsert({
      where: { id: 'demo-post-2' },
      update: {},
             create: {
         id: 'demo-post-2',
         title: 'Building Modern Web Applications',
         description: 'Learn about the latest trends in web development',
         content: `
           <h2>Building Modern Web Applications</h2>
           <p>Modern web development has evolved significantly over the past decade. Today's applications need to be:</p>
           <ul>
             <li><strong>Fast</strong> - Users expect instant loading times</li>
             <li><strong>Responsive</strong> - Work seamlessly across all devices</li>
             <li><strong>Accessible</strong> - Available to users with disabilities</li>
             <li><strong>Secure</strong> - Protect user data and privacy</li>
           </ul>
           <h3>Key Technologies</h3>
           <p>Some of the most popular technologies for modern web development include:</p>
           <ul>
             <li>React and Next.js for frontend</li>
             <li>TypeScript for type safety</li>
             <li>Tailwind CSS for styling</li>
             <li>Prisma for database management</li>
           </ul>
         `,
         excerpt: 'Learn about the latest trends in web development',
         coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
         published: true,
         featured: false,
         views: 18,
         authorId: user.id,
       },
    }),
  ])

  console.log('Database seeded successfully!')
  console.log('Demo user:', user.email)
  console.log('Demo posts created:', posts.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 