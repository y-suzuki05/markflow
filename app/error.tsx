"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function Error({ retry }: { retry: () => void }) {
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
      <Text
        mb={"16px"}
        fontWeight={700}
        fontSize={{ base: "20px", md: "24px" }}
      >
        エラーが発生しました
      </Text>
      <Text mb={"24px"}>
        読み込みに失敗しました。しばらくしてから、もう一度お試しください
      </Text>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap="12px"
        align="stretch"
        justifyContent="center"
      >
        <Link href={`/`}>
          <Box
            display={"inline-block"}
            w={{ base: "full", md: "auto" }}
            minH="44px"
            border={"1px solid"}
            borderColor={"#E2E8F0"}
            py={"10px"}
            px={"16px"}
            borderRadius={"md"}
            bg={"#fff"}
          >
            トップへ戻る
          </Box>
        </Link>
        <Button
          w={{ base: "full", md: "auto" }}
          fontSize={{ base: "14px", md: "16px" }}
          colorPalette="teal"
          variant="solid"
          px={"16px"}
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
