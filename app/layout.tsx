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
            h={{ base: "60px", md: "64px" }}
            px={{ base: "16px", md: "40px" }}
            bg={"#fff"}
            borderBottom={"1px solid"}
            borderBottomColor={"#E2E8F0"}
          >
            <Link href={"/"} style={{ display: "inline-flex", height: "100%" }}>
              <Flex gap={{ base: "8px", md: "12px" }} align={"center"}>
                <Image
                  src={"/logo-icon.png"}
                  alt={""}
                  boxSize={{ base: "28px", md: "32px" }}
                />
                <Box>
                  <Text
                    fontWeight={"700"}
                    fontSize={{ base: "14px", md: "16px" }}
                  >
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
