import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Layout from '../../components/Layout.js';
import '../../styles/globals.css';

interface Frontmatter {
  title: string;
  date: string;
  description: string;
  thumbnail?: string;
}

interface Post {
  slug: string;
  frontmatter: Frontmatter;
  excerpt: string;
}

export default async function Blogs() {
  const postsDirectory = path.join(process.cwd(), 'content');
  const fileNames = fs.readdirSync(postsDirectory);

  const posts: Post[] = await Promise.all(
    fileNames.map(async (fileName): Promise<Post> => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const frontmatter = data as Frontmatter;

      const excerpt = content.slice(0, 100).replace(/<[^>]+>/g, '');

      return {
        slug: fileName.replace('.md', ''),
        frontmatter,
        excerpt,
      };
    })
  );

  posts.sort((a, b) => {
    return (
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
    );
  });

  return (
    <Layout>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Blog</h2>
            <div className="mt-10 space-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="flex max-w-xl flex-col items-start justify-between"
                >
                  <div className="group relative">
                    {post.frontmatter.thumbnail && (
                      <img
                        src={post.frontmatter.thumbnail}
                        alt={post.frontmatter.title}
                        className="w-32 h-32 object-cover rounded-md mb-4"
                      />
                    )}
                    <div className="flex items-center gap-x-4 text-xs">
                      <div className="text-gray-500">{post.frontmatter.date}</div>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-blue-700 group-hover:text-blue-400">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-3 text-lg font-semibold leading-6 text-blue-700 group-hover:text-blue-400"
                      >
                        {post.frontmatter.title}
                      </Link>
                    </h3>
                    <p className="mt-5 text-sm leading-6 text-gray-600">
                      {post.excerpt}...
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
