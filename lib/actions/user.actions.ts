"use server"

import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../validation/mongoose";
import { revalidatePath } from "next/cache"


export async function fetchUser(userId: string) {
  try {
   
    return await User.findOne({ id: userId })
    // .populate({
    //   path:'communities',
    //   model: community
    // });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
   

    await User.findOneAndUpdate(
      { id: userId },
      {
        username,
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}


export async function fetchUserPosts(userId: string) {
  try {
   
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", 
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}



export async function updateUsers({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
   

    await User.findOneAndUpdate(
      { id: userId },
      {
        username,
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

