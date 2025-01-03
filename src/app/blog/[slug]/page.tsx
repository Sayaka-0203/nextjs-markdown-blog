import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import Layout from '../../../../components/Layout.js';

interface Frontmatter {
  title: string;
  date: string;
  thumbnail?: string;
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'content');
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => ({
    slug: fileName.replace('.md', ''),
  }));
}

export default async function BlogPost(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const { slug } = params;

  const filePath = path.join(process.cwd(), 'content', `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');

  const { data, content } = matter(fileContents);
  const frontmatter = data as Frontmatter;

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);
  const contentHtml = processedContent.toString();

  return (
    <Layout>
      <div className="bg-white px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <div className="mb-6">
            <img
              src={frontmatter.thumbnail || '/default-thumbnail.jpg'}
              alt={frontmatter.title}
              className="mt-4 w-64 h-auto mx-auto"
            />
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {frontmatter.title}
          </h1>
          <div className="mt-2 text-gray-500">
            <time dateTime={frontmatter.date}>
              {new Date(frontmatter.date).toLocaleDateString()}
            </time>
          </div>
          <div
            className="mt-6"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          ></div>
        </div>
      </div>
    </Layout>
  );
}
