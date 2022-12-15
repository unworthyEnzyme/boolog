import useSwr from "swr";
import { BlogFeedItem } from "./BlogFeedItem";

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  return await res.json();
};

type Blog = {
  id: number;
  title: string;
  createdAt: string;
  author: {
    username: string;
  };
  _count: {
    comments: number;
    likes: number;
    dislikes: number;
  };
};

export function BlogFeed() {
  const { data } = useSwr<Blog[]>("/api/blogs?take=100", fetcher);
  return (
    <ul className="flex flex-col items-center gap-2 p-2 divide-y">
      {data?.map((blog) => (
        <BlogFeedItem key={blog.id} blog={blog} />
      ))}
    </ul>
  );
}
