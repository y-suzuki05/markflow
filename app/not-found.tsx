import { Box, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      w={{ base: "calc(100% - 32px)", md: "full" }}
      maxW="760px"
      mx="auto"
      my={{ base: "24px", md: "48px" }}
      px={{ base: "20px", md: "64px" }}
      py={{ base: "32px", md: "64px" }}
      fontSize={{ base: "14px", md: "16px" }}
      overflowWrap="anywhere"
      bg={"#fff"}
      textAlign={"center"}
    >
      <Heading
        as={"h2"}
        fontSize={{ base: "36px", md: "48px" }}
        mb={{ base: "20px", md: "32px" }}
        color={"#319795"}
      >
        404
      </Heading>
      <Text
        mb={"16px"}
        fontWeight={700}
        fontSize={{ base: "20px", md: "24px" }}
      >
        ページが見つかりません
      </Text>
      <Text mb={"24px"}>
        お探しのページは存在しないか、URLが正しくない可能性があります。
      </Text>
      <Link href={"/bookmarks"}>
        <Box
          display={"inline-block"}
          w={{ base: "full", md: "auto" }}
          minH="44px"
          py={"10px"}
          px={"16px"}
          borderRadius={"md"}
          bg={"#319795"}
          color={"#fff"}
          fontWeight={700}
        >
          一覧へ戻る
        </Box>
      </Link>
    </Box>
  );
}
