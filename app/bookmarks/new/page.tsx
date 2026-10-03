import { Box, Heading, Flex } from "@chakra-ui/react";
import Link from "next/link";
import BookmarkForm from "@/app/components/bookmark-form";

export default function Page() {
  return (
    <Box
      w="full"
      maxW="47.5rem"
      mx="auto"
      my={{ base: "6", md: "12" }}
      px="4"
      fontSize={{ base: "sm", md: "md" }}
      overflowWrap="anywhere"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        justifyContent="space-between"
        gap={{ base: "3", md: "6" }}
      >
        <Heading fontSize={{ base: "1.375rem", md: "2xl" }} lineHeight="1.4">
          新規ブックマーク登録
        </Heading>
        <Link href={`/bookmarks`}>
          <Box
            display={"inline-block"}
            textAlign="center"
            w={{ base: "full", md: "auto" }}
            minH="11"
            border={"1px solid"}
            borderColor={"#E2E8F0"}
            py={"2.5"}
            px={"4"}
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
        mt={{ base: "5", md: "6" }}
        p={{ base: "5", md: "8" }}
      >
        <BookmarkForm />
      </Box>
    </Box>
  );
}
