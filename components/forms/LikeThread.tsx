"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { addLikeToThread} from "@/lib/actions/thread.actions";
import { useEffect, useState } from "react";

interface Props {
    threadId: string;
    userId: string;
    totalLike: {}[];
    isLike?: boolean;
}

function LikeThread({
    threadId,
    totalLike,
    userId,
    isLike,
}: Props) {
    const [isLiked, setIsLiked] = useState<boolean | null>(null);
    useEffect(() => {    
      setIsLiked(isLike);
    }, [isLike]);
    const handleLikeClick = async () => {
      setIsLiked((prevIsLiked) => {      
        const updatedIsLiked = !prevIsLiked;
        
        addLikeToThread(JSON.parse(threadId), pathname, userId)
          .then(() => {          
            setIsLiked(updatedIsLiked);
          })
          .catch((error) => {
            console.error("Error updating like:", error);          
          });
  
        return updatedIsLiked;
      });
    };
  const pathname = usePathname();
  return (
    <div className="item-center flex gap-2">
      <Image
        src={isLiked === false  ? '/assets/heart-gray-filled.svg' : '/assets/heart-gray.svg'}
        alt='heart'
        width={24}
        height={24}
        className='cursor-pointer object-contain'
        onClick={handleLikeClick}
      />
      <p className="mt-1 text-subtle-medium text-gray-1">{totalLike.length} like</p>
      
    </div>
  );
}

export default LikeThread;
