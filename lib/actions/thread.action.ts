import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../validation/mongoose"

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
  }
  

export default async function createThread({text,author,communityId,path}: Params) {
    try {
        connectToDB();
        const createdThread = await Thread.create({
            text,
            author,
            communityId: null,
        });
            await User.findByIdAndUpdate({
                $push:{thread: createdThread._id}
            })
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(error.message);
    }
}