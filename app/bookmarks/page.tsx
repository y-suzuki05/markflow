import { Box, Heading, Card, Text, Stack, Flex } from "@chakra-ui/react";
import { db } from "@/lib/db";
import { bookmarksTable } from "@/lib/db/schema";
import Link from "next/link";
import { desc } from "drizzle-orm";

async function getBookmarks() {
  "use cache";
  return db
    .select()
    .from(bookmarksTable)
    .orderBy(desc(bookmarksTable.createdAt));
}

export default async function Page() {
  const bookmarks = await getBookmarks();
  return (
    <Box
      w="full"
      maxW="47.5rem"
      mx="auto"
      my={{ base: "6", md: "12" }}
      px="4"
      fontSize={{ base: "sm", md: "md" }}
      overflowWrap="anywhere"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        justifyContent="space-between"
        gap={{ base: "3", md: "6" }}
      >
        <Heading fontSize={{ base: "1.375rem", md: "2xl" }} lineHeight="1.4">
          ブックマーク一覧
        </Heading>
        <Link href={"/bookmarks/new"}>
          <Box
            textAlign="center"
            minH="11"
            py={"2.5"}
            px={"4"}
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
            <Card.Root
              key={bookmark.id}
              p={{ base: "4", md: "6" }}
              gap={{ base: "3", md: "4" }}
            >
              <Card.Header
                p={0}
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight={700}
                color={"#2D3748"}
              >
                {bookmark.title}
              </Card.Header>
              <Card.Body p={0}>
                <Text color={"#718096"} fontSize={"xs"}>
                  {bookmark.url}
                </Text>
                <Text mt={"3"}>
                  {bookmark.memo.length > 100
                    ? `${bookmark.memo.slice(0, 100)}…`
                    : bookmark.memo}
                </Text>
              </Card.Body>
              <Card.Footer
                p={0}
                flexDirection={{ base: "column", md: "row" }}
                alignItems={{ base: "stretch", md: "center" }}
                justifyContent="space-between"
                gap="3"
              >
                <Text color={"#718096"} fontSize={"xs"}>
                  登録日時：{bookmark.createdAt.toLocaleString("ja-JP")}
                </Text>
                <Link href={`/bookmarks/${bookmark.id}`}>
                  <Box
                    textAlign="center"
                    minH="11"
                    border={"1px solid"}
                    borderColor={"#E2E8F0"}
                    py={"2.5"}
                    px={"4"}
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
