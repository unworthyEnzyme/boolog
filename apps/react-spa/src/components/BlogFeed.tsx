import useSwr from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  return await res.json();
};

type Blog = {
  id: number;
  title: string;
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
    <ul>
      {data?.map((blog) => (
        <li key={blog.id} className="bg-slate-100 m-1">
          <div>{blog.title}</div>
          <div>{blog.author.username}</div>
        </li>
      ))}
    </ul>
  );
}
