import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MarkFlow",
  description: "参考記事を保存するブックマークアプリ",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <Box
            as={"header"}
            h={{ base: "3.75rem", md: "16" }}
            px={{ base: "4", md: "10" }}
            bg={"#fff"}
            borderBottom={"1px solid"}
            borderBottomColor={"#E2E8F0"}
          >
            <Link href={"/"} style={{ display: "inline-flex", height: "100%" }}>
              <Flex gap={{ base: "2", md: "3" }} align={"center"}>
                <Image
                  src={"/logo-icon.png"}
                  alt={""}
                  boxSize={{ base: "7", md: "8" }}
                />
                <Box>
                  <Text fontWeight={"700"} fontSize={{ base: "sm", md: "md" }}>
                    MarkFlow
                  </Text>
                </Box>
              </Flex>
            </Link>
          </Box>
          {children}
        </Providers>
      </body>
    </html>
  );
}
