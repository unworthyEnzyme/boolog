import {
  BaseEntity,
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

  @Column({ unique: true })
  username: string;

  @Column()
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
}

@Entity()
export class Blog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: "CASCADE" })
  author: User;

  @OneToMany(() => Like, (like) => like.owner, {
    cascade: true,
    onDelete: "CASCADE",
  })
  likes: Like[];

  @OneToMany(() => Dislike, (dislike) => dislike.associatedBlog, {
    onDelete: "CASCADE",
  })
  dislikes: Dislike[];
}

@Entity()
@Unique(["owner", "associatedBlog"])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (owner) => owner.likes, { onDelete: "CASCADE" })
  owner: User;

  @ManyToOne(() => Blog, (blog) => blog.likes, { onDelete: "CASCADE" })
  associatedBlog: Blog;
}

@Entity()
@Unique(["owner", "associatedBlog"])
export class Dislike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (owner) => owner.dislikes, { onDelete: "CASCADE" })
  owner: User;

  @ManyToOne(() => Blog, (blog) => blog.dislikes, { onDelete: "CASCADE" })
  associatedBlog: Blog;
}
