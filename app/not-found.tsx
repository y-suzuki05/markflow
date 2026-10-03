import { Box, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      w={{ base: "calc(100% - 2rem)", md: "full" }}
      maxW="47.5rem"
      mx="auto"
      my={{ base: "6", md: "12" }}
      px={{ base: "5", md: "16" }}
      py={{ base: "8", md: "16" }}
      fontSize={{ base: "sm", md: "md" }}
      overflowWrap="anywhere"
      bg={"#fff"}
      textAlign={"center"}
    >
      <Heading
        as={"h2"}
        fontSize={{ base: "4xl", md: "5xl" }}
        mb={{ base: "5", md: "8" }}
        color={"#319795"}
      >
        404
      </Heading>
      <Text mb={"4"} fontWeight={700} fontSize={{ base: "xl", md: "2xl" }}>
        ページが見つかりません
      </Text>
      <Text mb={"6"}>
        お探しのページは存在しないか、URLが正しくない可能性があります。
      </Text>
      <Link href={"/bookmarks"}>
        <Box
          display={"inline-block"}
          w={{ base: "full", md: "auto" }}
          minH="11"
          py={"2.5"}
          px={"4"}
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
