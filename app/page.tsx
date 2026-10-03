import { Box, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
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
      >
        MarkFlow
      </Heading>
      <Text mb={"4"}>
        気になる記事も、もう一度読みたい記事も、一言メモと一緒に保存。いつでも見返せるブックマークアプリです。
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
          ブックマーク一覧を見る
        </Box>
      </Link>
    </Box>
  );
}
