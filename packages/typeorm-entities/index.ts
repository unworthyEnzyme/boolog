import {
  BaseEntity,
  Check,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Blog, (blog) => blog.author, {
    onDelete: "CASCADE",
  })
  blogs: Blog[];

  @OneToMany(() => Like, (like) => like.owner, {
    onDelete: "CASCADE",
  })
  likes: Like[];

  @OneToMany(() => Dislike, (dislike) => dislike.owner, {
    onDelete: "CASCADE",
  })
  dislikes: Dislike[];

  @OneToMany(() => Comment, (comment) => comment.author, {
    onDelete: "CASCADE",
  })
  comments: Comment[];
}

@Entity()
export class Blog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.blogs, {
    onDelete: "CASCADE",
    nullable: false,
  })
  author: User;

  @OneToMany(() => Like, (like) => like.associatedBlog, {
    cascade: true,
    onDelete: "CASCADE",
  })
  likes: Like[];

  @OneToMany(() => Dislike, (dislike) => dislike.associatedBlog, {
    onDelete: "CASCADE",
  })
  dislikes: Dislike[];

  @OneToMany(() => Comment, (comment) => comment.associatedBlog, {
    onDelete: "CASCADE",
  })
  comments: Comment[];
}

@Entity()
@Check("(associatedBlog IS NOT NULL) OR (associatedComment IS NOT NULL)")
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  content: string;

  @ManyToOne(() => User, (author) => author.comments, {
    onDelete: "CASCADE",
    nullable: false,
  })
  author: User;

  @ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: "CASCADE" })
  associatedBlog: Blog;

  @OneToMany(() => Like, (like) => like.associatedComment, {
    onDelete: "CASCADE",
  })
  likes: Like[];

  @OneToMany(() => Dislike, (dislike) => dislike.associatedComment, {
    onDelete: "CASCADE",
  })
  dislikes: Dislike[];

  @ManyToOne(() => Comment, (comment) => comment.comments, {
    onDelete: "CASCADE",
  })
  associatedComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.associatedComment, {
    onDelete: "CASCADE",
  })
  comments: Comment[];
}

@Entity()
@Unique(["owner", "associatedBlog", "associatedComment"])
@Check("(associatedBlog IS NOT NULL) OR (associatedComment IS NOT NULL)")
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (owner) => owner.likes, {
    onDelete: "CASCADE",
    nullable: false,
  })
  owner: User;

  @ManyToOne(() => Blog, (blog) => blog.likes, { onDelete: "CASCADE" })
  associatedBlog: Blog;

  @ManyToOne(() => Comment, (comment) => comment.likes, { onDelete: "CASCADE" })
  associatedComment: Comment;
}

@Entity()
@Unique(["owner", "associatedBlog", "associatedComment"])
@Check("(associatedBlog IS NOT NULL) OR (associatedComment IS NOT NULL)")
export class Dislike extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (owner) => owner.dislikes, {
    onDelete: "CASCADE",
    nullable: false,
  })
  owner: User;

  @ManyToOne(() => Blog, (blog) => blog.dislikes, { onDelete: "CASCADE" })
  associatedBlog: Blog;

  @ManyToOne(() => Comment, (comment) => comment.dislikes, {
    onDelete: "CASCADE",
  })
  associatedComment: Comment;
}
