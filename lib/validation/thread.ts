import * as z from 'zod';

export const ThreadValidation =z.object({
    thread:z.string().nonempty().min(3,{message:"bài đăng phải có tối thiểu 3 ký tự"}),
    accountId:z.string(),
})

export const CommentValidation =z.object({
    thread:z.string().nonempty().min(3,{message:"bài đăng phải có tối thiểu 3 ký tự"}),
})