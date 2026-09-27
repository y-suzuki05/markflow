import { Box, Heading, Card, Text, Stack, Flex } from "@chakra-ui/react";
import { db } from "@/lib/db";
import { bookmarksTable } from "@/lib/db/schema";
import Link from "next/link";
import { desc } from "drizzle-orm";

async function getBookmarks() {
  return db
    .select()
    .from(bookmarksTable)
    .orderBy(desc(bookmarksTable.createdAt));
}

export default async function Page() {
  const bookmarks = await getBookmarks();
  return (
    <Box w="full" maxW="760px" mx="auto" my="48px" px="4">
      <Flex align={"center"} justifyContent={"space-between"}>
        <Heading>ブックマーク一覧</Heading>
        <Link href={"/bookmarks/new"}>
          <Box
            py={"10px"}
            px={"16px"}
            borderRadius={"md"}
            bg={"#319795"}
            color={"#fff"}
            fontWeight={700}
          >
            新規登録
          </Box>
        </Link>
      </Flex>
      {bookmarks.length === 0 ? (
        <Text mt={4}>ブックマークはまだありません</Text>
      ) : (
        <Stack mt={4} gap={4}>
          {bookmarks.map((bookmark) => (
            <Card.Root key={bookmark.id} p={"24px"}>
              <Card.Header fontWeight={700} color={"#2D3748"}>
                {bookmark.title}
              </Card.Header>
              <Card.Body>
                <Text color={"#718096"} fontSize={"12px"}>
                  {bookmark.url}
                </Text>
                <Text mt={"12px"}>
                  {bookmark.memo.length > 100
                    ? `${bookmark.memo.slice(0, 100)}…`
                    : bookmark.memo}
                </Text>
              </Card.Body>
              <Card.Footer justifyContent={"space-between"}>
                <Text color={"#718096"} fontSize={"12px"}>
                  登録日時：{bookmark.createdAt.toLocaleString("ja-JP")}
                </Text>
                <Link href={`/bookmarks/${bookmark.id}`}>
                  <Box
                    border={"1px solid"}
                    borderColor={"#E2E8F0"}
                    py={"10px"}
                    px={"16px"}
                    borderRadius={"md"}
                  >
                    詳細を見る
                  </Box>
                </Link>
              </Card.Footer>
            </Card.Root>
          ))}
        </Stack>
      )}
    </Box>
  );
}
