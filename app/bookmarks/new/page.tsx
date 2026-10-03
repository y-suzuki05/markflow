import { Box, Heading, Flex } from "@chakra-ui/react";
import Link from "next/link";
import BookmarkForm from "@/app/components/bookmark-form";

export default function Page() {
  return (
    <Box
      w="full"
      maxW="760px"
      mx="auto"
      my={{ base: "24px", md: "48px" }}
      px="4"
      fontSize={{ base: "14px", md: "16px" }}
      overflowWrap="anywhere"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        justifyContent="space-between"
        gap={{ base: "12px", md: "24px" }}
      >
        <Heading fontSize={{ base: "22px", md: "24px" }} lineHeight="1.4">
          新規ブックマーク登録
        </Heading>
        <Link href={`/bookmarks`}>
          <Box
            display={"inline-block"}
            textAlign="center"
            w={{ base: "full", md: "auto" }}
            minH="44px"
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
        mt={{ base: "20px", md: "24px" }}
        p={{ base: "20px", md: "32px" }}
      >
        <BookmarkForm />
      </Box>
    </Box>
  );
}
