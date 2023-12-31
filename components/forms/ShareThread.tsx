import React, { useState } from "react";
import { useRouter } from "next/router";

import Image from "next/image";
import { TwitterShareButton } from "react-share";

interface Props {
  threadId: string;
  title: string; // Thêm props cho tiêu đề bài viết
  description: string; // Thêm props cho mô tả bài viết
  imageUrl: string; // Thêm props cho URL hình ảnh
}

function ShareBtn({
  threadId,
  title,
  description,
  imageUrl,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = useRouter().pathname;

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Image
        src="/assets/share.svg"
        alt="Chia sẻ"
        width={24}
        height={24}
        className="cursor-pointer object-contain"
        onClick={handleModalOpen}
      />

      <div
        className="modal"
        style={{
          display: isModalOpen ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >

        
        <button onClick={handleModalClose}>Đóng</button>
      </div>
    </>
  );
}

export default ShareBtn;
