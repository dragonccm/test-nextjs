import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ThreadCard from "@/components/cards/ThreadCard";
import Pagination from "@/components/shared/Pagination";

import { fetchPosts } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { Suspense } from "react";
import Loadings from "./loading";
import { Button } from "@/components/ui/button";


async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  );
  return (
    <>
      <h1 className='head-text text-left'>Home</h1>
      <Suspense fallback={<Loadings />}>
        <section className='mt-9 flex flex-col gap-10'>
          {result.posts.length === 0 ? (
            <p className='no-result'>không có bài viết nào </p>
          ) : (
            <>
              {result.posts.map((post) => (
                <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={
                    post.text.length >=700 ? post.text.slice(0, 600)+'\nxem thêm....' : post.text
                    }
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                totalLike={post.like}
                isLike={post.like.indexOf(user.id) == -1 ? true : false}
                img={post.image? post.image:''}
                />
                ))}
            </>
          )}
        </section>
      </Suspense >

      <Pagination
        path='/'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Home;
