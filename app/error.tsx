"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function Error({ retry }: { retry: () => void }) {
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
      <Text mb={"4"} fontWeight={700} fontSize={{ base: "xl", md: "2xl" }}>
        エラーが発生しました
      </Text>
      <Text mb={"6"}>
        読み込みに失敗しました。しばらくしてから、もう一度お試しください
      </Text>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap="3"
        align="stretch"
        justifyContent="center"
      >
        <Link href={`/`}>
          <Box
            display={"inline-block"}
            w={{ base: "full", md: "auto" }}
            minH="11"
            border={"1px solid"}
            borderColor={"#E2E8F0"}
            py={"2.5"}
            px={"4"}
            borderRadius={"md"}
            bg={"#fff"}
          >
            トップへ戻る
          </Box>
        </Link>
        <Button
          w={{ base: "full", md: "auto" }}
          fontSize={{ base: "sm", md: "md" }}
          colorPalette="teal"
          variant="solid"
          px={"4"}
          fontWeight={700}
          size={"lg"}
          onClick={() => retry()}
        >
          もう一度試す
        </Button>
      </Flex>
    </Box>
  );
}
