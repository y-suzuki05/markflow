import { Box, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
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
      >
        MarkFlow
      </Heading>
      <Text mb={"16px"}>
        気になる記事も、もう一度読みたい記事も、一言メモと一緒に保存。いつでも見返せるブックマークアプリです。
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
          ブックマーク一覧を見る
        </Box>
      </Link>
    </Box>
  );
}
