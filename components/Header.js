import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 border-b z-10 bg-white">
      <div className="max-w-4xl mx-auto flex justify-between items-center h-12">
        <Link href="/">BLOG</Link>
      </div>
    </header>
  );
}