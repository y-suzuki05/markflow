"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function Error({ retry }: { retry: () => void }) {
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
      <Text mb={"16px"} fontWeight={700} fontSize={"24px"}>
        エラーが発生しました
      </Text>
      <Text mb={"24px"}>
        読み込みに失敗しました。しばらくしてから、もう一度お試しください
      </Text>
      <Flex gap={"12px"} justifyContent={"center"}>
        <Link href={`/`}>
          <Box
            display={"inline-block"}
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
          alignSelf="flex-end"
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
