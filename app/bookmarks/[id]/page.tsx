import { Box, Flex, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import { db } from "@/lib/db";
import { bookmarksTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import UrlCopyButton from "@/app/components/url-copy-button";
import { notFound } from "next/navigation";

async function getBookmark(id: number) {
  'use cache'
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

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  const bookmark = await getBookmark(id);

  if (!bookmark) notFound();

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
      <Link href={`/bookmarks`}>
        <Box
          display={"inline-block"}
          w={{ base: "full", md: "auto" }}
          textAlign="center"
          minH="11"
          border={"1px solid"}
          borderColor={"#E2E8F0"}
          py={"2.5"}
          px={"4"}
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
        mt={{ base: "5", md: "6" }}
        p={{ base: "5", md: "8" }}
      >
        <Heading fontSize={{ base: "1.375rem", md: "2xl" }} lineHeight="1.4">
          {bookmark.title}
        </Heading>
        <Text color={"#718096"} fontSize={"xs"} mt={"3"}>
          {bookmark.url}
        </Text>
        <Text
          mt={{ base: "5", md: "6" }}
          whiteSpace="pre-wrap"
          py={{ base: "5", md: "6" }}
          borderTop={"1px solid"}
          borderBottom={"1px solid"}
          borderColor={"#E2E8F0"}
        >
          {bookmark.memo}
        </Text>
        <Flex
          mt={{ base: "5", md: "6" }}
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "stretch", md: "center" }}
          gap={{ base: "4", md: "3" }}
          justifyContent={"space-between"}
        >
          <Text color={"#718096"} fontSize={"xs"}>
            登録日時：
            {bookmark.createdAt.toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
            })}
          </Text>
          <Flex
            direction={{ base: "column", sm: "row" }}
            gap="3"
            flexShrink={0}
          >
            <UrlCopyButton url={bookmark.url} />
            <ChakraLink
              w={{ base: "full", md: "auto" }}
              minH="11"
              justifyContent="center"
              fontSize={{ base: "sm", md: "md" }}
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              py={"2.5"}
              px={"4"}
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
