import { MdOutlineThumbUp, MdOutlineThumbDown } from "react-icons/md";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { format } from "date-fns";

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

export function BlogFeedItem({ blog }: { blog: Blog }) {
  return (
    <article className="flex flex-col text-slate-100 min-w-full p-4 hover:bg-slate-800 group hover:cursor-pointer transition-colors ease-in-out duration-150">
      <div className="font-semibold rounded-md max-w-min p-1 hover:cursor-pointer hover:underline hover:underline-offset-4 hover:text-sky-400">
        {blog.author.username}
      </div>
      <p className="text-sm">{format(new Date(blog.createdAt), "PP")}</p>
      <div className="text-xl font-extrabold group-hover:text-pink-400">
        {blog.title}
      </div>
      <div className="flex items-center gap-4 mt-4 self-end">
        <div className="flex items-center gap-1">
          <MdOutlineThumbUp size={16} />
          <span>{blog._count.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <MdOutlineThumbDown size={16} />
          <span>{blog._count.dislikes}</span>
        </div>
        <div className="flex items-center gap-1">
          <IoChatbubbleEllipsesSharp size={16} />
          <span>{blog._count.comments}</span>
        </div>
      </div>
    </article>
  );
}
