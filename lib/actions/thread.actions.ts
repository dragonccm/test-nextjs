"use server";

import { revalidatePath } from "next/cache";



import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";


export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  const skipAmount = (pageNumber - 1) * pageSize;
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });


  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string,
  author: string,
  like: Array<string>,
  communityId: string | null,
  path: string,
  image: string
}

export async function createThread({ text, author, like, communityId, path, image }: Params
) {
  try {


    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      like,
      community: communityIdObject,
      image,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {

      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {

    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }


    const descendantThreads = await fetchAllChildThreads(id);


    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];


    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()),
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()),
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );


    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });


    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );


    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {


  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {


  try {

    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }


    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });


    const savedCommentThread = await commentThread.save();


    originalThread.children.push(savedCommentThread._id);


    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}


export async function addLikeToThread(
  threadId: string,
  path: string,
  userId: string,
) {
  try {
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    if (originalThread.like !== undefined) {
      const likes = originalThread.like;

      // Kiểm tra xem có ID nào trùng với userId hay không
      const index = likes.indexOf(userId);
      if (index !== -1) {
        console.log("XOÁ LIKE ĐƯỢC RỒI");
        likes.splice(index, 1);
      } else {
        console.log("LIKE ĐƯỢC RỒI");
        likes.push(userId);
      }

      // Lưu lại thread
      originalThread.like = likes;
      const savedThread = await originalThread.save();

      if (!savedThread) {
        throw new Error("Unable to update like");
      } else {
        console.log("");
      }
      let value = index == -1 ? true : false;
      return value
    } else {
      console.log(originalThread + "nó đó");
    }
  } catch (err) {
    console.error("Error while adding like:", err);
    throw new Error("Unable to add like");
  }
}

/*" use server"; 
import { revalidatePath } from "next/cache"; 
import User from "../models/user.model"; 
import Thread from "../models/thread.model"; 
import Community from "../models/community.model"; 

export async function fetchPosts(pageNumber = 1, pageSize = 20) { 
  const skipAmount = (pageNumber - 1) * pageSize; 
  const posts = await Thread.find( { parentId: null }) 
    .sort({ createdAt: -1 }) 
    .skip(skipAmount) 
    .limit(pageSize) 
    .populate('author', 'name image _id') 
    .populate('community', 'name image _id') 
    .populate({ 
      path: "children", 
      populate: { path: "author", select: "name parentId image" }, 
    }) 
    .exec();

  const totalPostsCount = await Thread.countDocuments({ parentId: null }); 
  return { posts, isNext: totalPostsCount > pageNumber * pageSize }; 
}

export async function createThread({ text, author, like, communityId, path, image }) { 
  try { 
    const community = communityId ? await Community.findById(communityId, '_id') : null; 
    const user = await User.findById(author);

    if (!user) throw new Error("User not found");

    const thread = await Thread.create({
      text,
      author,
      like,
      community,
      image,
    });

    user.threads.push(thread._id);
    await user.save();

    if (community) {
      community.threads.push(thread._id);
      await community.save();
    }

    revalidatePath(path);
    return thread;
  } catch (error) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

async function fetchAllChildThreads(threadId, accumulator = []) {
  const childThreads = await Thread.find({ parentId: threadId }, '_id');
  for (const child of childThreads) {
    accumulator.push(child);
    await fetchAllChildThreads(child._id, accumulator);
  }
  return accumulator;
}

export async function deleteThread(id, path) {
  try {
    const threadToDelete = await Thread.findById(id);
    if (!threadToDelete) throw new Error("Thread not found");

    const descendantThreads = await fetchAllChildThreads(id);

    const idsToDelete = descendantThreads.map(thread => thread._id);
    idsToDelete.push(id);

    await Promise.all([
      Thread.deleteMany({ _id: { $in: idsToDelete } }),
      User.updateMany({ threads: { $in: idsToDelete } }, { $pull: { threads: { $in: idsToDelete } } }),
      Community.updateMany({ threads: { $in: idsToDelete } }, { $pull: { threads: { $in: idsToDelete } } })
    ]);

    revalidatePath(path);
  } catch (error) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchThreadById(threadId) {
  try {
    const thread = await Thread.findById(threadId)
      .populate({ path: "author", select: 'name image' })
      .populate({ path: "community", select: 'name image' })
      .populate({ path: "children", populate: { path: "author", select: "name parentId image" } })
      .exec();

    return thread;
  } catch (error) {
    throw new Error(`Unable to fetch thread: ${error.message}`);
  }
}

export async function addCommentToThread(threadId, commentText, userId, path) {
  try {
    const thread = await Thread.findById(threadId);
    if (!thread) throw new Error("Thread not found");

    const comment = await Thread.create({
      text: commentText,
      author: userId,
      parentId: threadId
    });

    thread.children.push(comment._id);
    await thread.save();

    revalidatePath(path);
    return comment;
  } catch (error) {
    throw new Error(`Unable to add comment: ${error.message}`);
  }
}

export async function addLikeToThread(threadId, userId) {
  try {
    const thread = await Thread.findById(threadId);
    if (!thread) throw new Error("Thread not found");

    const index = thread.like.indexOf(userId);
    if (index === -1) {
      thread.like.push(userId);
    } else {
      thread.like.splice(index, 1);
    }

    await thread.save();
    return index === -1;
  } catch (error) {
    throw new Error(`Unable to add like: ${error.message}`);
  }
}*/