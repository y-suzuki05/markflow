import { Box, Flex, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import { db } from "@/lib/db";
import { bookmarksTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import UrlCopyButton from "@/app/components/url-copy-button";
import { notFound } from "next/navigation";

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

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  const bookmark = await getBookmark(id);

  if (!bookmark) notFound();

  return (
    <Box
      w="full"
      maxW="760px"
      mx="auto"
      my={{ base: "24px", md: "48px" }}
      px="4"
      fontSize={{ base: "14px", md: "16px" }}
      overflowWrap="anywhere"
    >
      <Link href={`/bookmarks`}>
        <Box
          display={"inline-block"}
          w={{ base: "full", md: "auto" }}
          textAlign="center"
          minH="44px"
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
        mt={{ base: "20px", md: "24px" }}
        p={{ base: "20px", md: "32px" }}
      >
        <Heading fontSize={{ base: "22px", md: "24px" }} lineHeight="1.4">
          {bookmark.title}
        </Heading>
        <Text color={"#718096"} fontSize={"12px"} mt={"12px"}>
          {bookmark.url}
        </Text>
        <Text
          mt={{ base: "20px", md: "24px" }}
          py={{ base: "20px", md: "24px" }}
          borderTop={"1px solid"}
          borderBottom={"1px solid"}
          borderColor={"#E2E8F0"}
        >
          {bookmark.memo}
        </Text>
        <Flex
          mt={{ base: "20px", md: "24px" }}
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "stretch", md: "center" }}
          gap={{ base: "16px", md: "12px" }}
          justifyContent={"space-between"}
        >
          <Text color={"#718096"} fontSize={"12px"}>
            登録日時：{bookmark.createdAt.toLocaleString("ja-JP")}
          </Text>
          <Flex
            direction={{ base: "column", sm: "row" }}
            gap="12px"
            flexShrink={0}
          >
            <UrlCopyButton url={bookmark.url} />
            <ChakraLink
              w={{ base: "full", md: "auto" }}
              minH="44px"
              justifyContent="center"
              fontSize={{ base: "14px", md: "16px" }}
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
