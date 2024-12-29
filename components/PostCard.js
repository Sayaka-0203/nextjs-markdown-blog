import Link from 'next/link';

const PostCard = ({ post }) => {
  return (
    <Link href={`/post/${post.slug}`}>
      {post.frontMatter.title}
    </Link>
  );
};

export default PostCard;