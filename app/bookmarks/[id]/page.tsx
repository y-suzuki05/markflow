import { Box, Flex, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import { db } from "@/lib/db";
import { bookmarksTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import UrlCopyButton from "@/app/components/UrlCopyButton";

async function getBookmark(id: number) {
  const rows = await db
    .select()
    .from(bookmarksTable)
    .where(eq(bookmarksTable.id, id));
  return rows[0];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  // TODO: 404ページ追加
  if (!Number.isInteger(id) || id < 1) {
    return <Box>なにもありません</Box>;
  }

  const bookmark = await getBookmark(id);

  // TODO: 404ページ追加
  if (!bookmark) return <Box>なにもありません</Box>;

  return (
    <Box w="full" maxW="760px" mx="auto" my="48px" px="4">
      <Link href={`/bookmarks`}>
        <Box
          display={"inline-block"}
          border={"1px solid"}
          borderColor={"#E2E8F0"}
          py={"10px"}
          px={"16px"}
          borderRadius={"md"}
          bg={"#fff"}
        >
          一覧へ戻る
        </Box>
      </Link>
      <Box
        bg={"#fff"}
        border={"1px solid"}
        borderColor={"#E2E8F0"}
        borderRadius={"md"}
        mt={"24px"}
        p={"32px"}
      >
        <Heading>{bookmark.title}</Heading>
        <Text color={"#718096"} fontSize={"12px"} mt={"12px"}>
          {bookmark.url}
        </Text>
        <Text
          mt={"24px"}
          py={"24px"}
          borderTop={"1px solid"}
          borderBottom={"1px solid"}
          borderColor={"#E2E8F0"}
        >
          {bookmark.memo}
        </Text>
        <Flex
          mt={"24px"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text color={"#718096"} fontSize={"12px"}>
            登録日時：{bookmark.createdAt.toLocaleString("ja-JP")}
          </Text>
          <Flex gap={"12px"}>
            <UrlCopyButton url={bookmark.url} />
            <ChakraLink
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              py={"10px"}
              px={"16px"}
              borderRadius={"md"}
              bg={"#319795"}
              color={"#fff"}
              fontWeight={700}
            >
              元記事を開く
            </ChakraLink>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
