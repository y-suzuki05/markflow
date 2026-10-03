import { Box, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
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
      <Heading as={"h2"} fontSize={"48px"} mb={"32px"} color={"#319795"}>
        404
      </Heading>
      <Text mb={"16px"} fontWeight={700} fontSize={"24px"}>
        ページが見つかりません
      </Text>
      <Text mb={"24px"}>
        お探しのページは存在しないか、URLが正しくない可能性があります。
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
          一覧へ戻る
        </Box>
      </Link>
    </Box>
  );
}
