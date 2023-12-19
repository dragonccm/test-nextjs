"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { addLikeToThread } from "@/lib/actions/thread.actions";
import { useState } from "react";

interface Props {
    threadId: string;
    userId: string;
    isComment?: boolean;
    isLike?: boolean;
}

function LikeThread({
    threadId,
    isComment,
    userId,
    isLike,
}: Props) {
    const [isLiked, setIsLiked] = useState<boolean | null>(null);

  const pathname = usePathname();
  
  return (
    <Image
      src={isLiked === false ? '/assets/57433-red-heart-flat-vector.svg' : '/assets/heart-gray.svg'}
      alt='heart'
      width={24}
      height={24}
      className='cursor-pointer object-contain'
      onClick={async () => {
        setIsLiked(isLike);
        const current=await addLikeToThread(JSON.parse(threadId), pathname, userId);
        setIsLiked(current);
      }}
    />
  );
}

export default LikeThread;
