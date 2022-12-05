import { z } from "zod";

export const SignupRequestSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().trim().min(1),
});

export const LoginRequestSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().trim().min(1),
});

export const CreateBlogRequestSchema = z.object({
  content: z.string().trim(),
});

export type SignupRequest = z.infer<typeof LoginRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type CreateBlogRequest = z.infer<typeof CreateBlogRequestSchema>;
