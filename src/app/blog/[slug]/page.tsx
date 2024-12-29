import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import Layout from '../../../../components/Layout.js';
import { NextPage } from 'next';

interface Params {
  slug: string;
}

const BlogPost: NextPage<{ params: Params }> = async ({ params }) => {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'content', `${slug}.md`);

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const title = data.title;
  const date = data.date;
  const thumbnail = data.thumbnail || '/default-thumbnail.jpg';
  const processedContent = await unified().use(remarkParse).use(remarkHtml).process(content);
  const contentHtml = processedContent.toString();

  return (
    <Layout>
      <div className="bg-white px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          {/* サムネイル画像 */}
          <div className="mb-6">
            <img
              src={thumbnail}
              alt={title}
              className="mt-4 w-64 h-auto mx-auto"
            />
          </div>

          {/* 記事のタイトル */}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h1>

          {/* 投稿日 */}
          <div className="mt-2 text-gray-500">
            <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
          </div>

          {/* 記事の内容 */}
          <div
            className="mt-6"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          ></div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
