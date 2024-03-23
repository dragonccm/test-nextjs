"use client";

import Image from "next/image";

import { addLikeToThread } from "@/lib/actions/thread.actions";
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
  const [isLiked, setIsLiked] = useState(false); 
  const [currlike, setTotalLike] = useState(0); 
  useEffect(() => {
    if (isLike !== undefined) {
      setIsLiked(isLike);
    }
    setTotalLike(totalLike.length)
  }, []);
  useEffect(() => {
    if (isLike !== undefined) {
      setIsLiked(isLike);
    }
  }, [isLike]);

  const handleLikeClick = async () => {
    setIsLiked((prevIsLiked) => {
      const updatedIsLiked = !prevIsLiked;

      addLikeToThread(JSON.parse(threadId), userId, updatedIsLiked)
        .then(() => {
          setIsLiked(updatedIsLiked);
          if(updatedIsLiked){
            setTotalLike(currlike-1)
          }else{
            setTotalLike(currlike+1)
          }
        })
        .catch((error) => {
          console.error("Error updating like:", error);
        });

      return updatedIsLiked;
    });
  };
  return (
    <>
      {isLiked === false ? (<div className="item-center flex gap-2">
        <Image
          src='/assets/heart-gray-filled.svg'
          alt='heart'
          width={24}
          height={24}
          className='cursor-pointer object-contain'
          onClick={handleLikeClick}
        />
        <p className="mt-1 text-subtle-medium text-gray-1">{currlike} like</p>
      </div>)
        :
        (<div className="item-center flex gap-2">
          <Image
            src='/assets/heart-gray.svg'
            alt='heart'
            width={24}
            height={24}
            className='cursor-pointer object-contain'
            onClick={handleLikeClick}
          />
          <p className="mt-1 text-subtle-medium text-gray-1">{currlike} like</p>
        </div>)}

    </>
  );
}

export default LikeThread;
