import { ActionIcon } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

const BackButton = () => {
    const router = useRouter()

  return (
    <ActionIcon onClick={() => router.back()}>
       <svg
            width={24}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 20"
          >
            <path
              className="back-icon--inverse"
              d="M1.5,10,10,18.5M1.5,10h21m-21,0L10,1.5"
            />
          </svg>
    </ActionIcon>
  )
}
export default BackButton
