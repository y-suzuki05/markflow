import { Box, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Box
      w="full"
      maxW="760px"
      mx="auto"
      my="48px"
      p={"64px"}
      bg={"#fff"}
      textAlign={"center"}
    >
      <Heading as={"h2"} fontSize={"48px"} mb={"32px"}>
        MarkFlow
      </Heading>
      <Text mb={"16px"}>
        気になる記事も、もう一度読みたい記事も、一言メモと一緒に保存。いつでも見返せるブックマークアプリです。
      </Text>
      <Link href={"/bookmarks"}>
        <Box
          display={"inline-block"}
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
