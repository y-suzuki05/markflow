import { Box, Heading, Flex } from "@chakra-ui/react";
import Link from "next/link";
import BookmarkForm from "@/app/components/bookmark-form";

export default function Page() {
  return (
    <Box w="full" maxW="760px" mx="auto" my="48px" px="4">
      <Flex align={"center"} justifyContent={"space-between"}>
        <Heading>新規ブックマーク登録</Heading>
        <Link href={`/bookmarks`}>
          <Box
            display={"inline-block"}
            border={"1px solid"}
            borderColor={"#E2E8F0"}
            py={"10px"}
            px={"16px"}
            borderRadius={"md"}
            bg={"#fff"}
          >
            一覧へ戻る
          </Box>
        </Link>
      </Flex>
      <Box
        bg={"#fff"}
        border={"1px solid"}
        borderColor={"#E2E8F0"}
        borderRadius={"md"}
        mt={"24px"}
        p={"32px"}
      >
        <BookmarkForm />
      </Box>
    </Box>
  );
}
