// app/page.tsx
import Link from 'next/link'
import { getContents } from '@/lib/db/content'
import { MotionDiv } from '@/components/motion';

export default async function Home() {
  const posts = await getContents({ take: 3, published: true })

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Our Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover amazing stories and insights from our community
            </p>
            <Link
              href="/blog"
              className="bg-white text-indigo-600 px-8 py-3 rounded-full font-medium text-lg hover:bg-opacity-90 transition-colors"
            >
              Start Reading
            </Link>
          </MotionDiv>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map?.((post: any) => (
            <MotionDiv
              key={post.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden "
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-indigo-600">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <Link
                  href={{
                    pathname: '/blog/[id]',
                    query: { id: post?.id },
                  }}
                  as={`/blog/${post?.id}`}
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Read More →
                </Link>
              </div>
            </MotionDiv>
          ))}
        </div>
      </section>
    </div>
  )
}