import { Box, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box as={"main"}>
      <Heading mb={"4"}>MarkFlow</Heading>
      <Text>あとで読みたい/読み返したい記事を保存するアプリ</Text>
    </Box>
  );
}
