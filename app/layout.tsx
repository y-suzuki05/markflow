import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import "./globals.css";

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
            h={"64px"}
            px={"40px"}
            bg={"#fff"}
            borderBottom={"1px solid"}
            borderBottomColor={"#E2E8F0"}
          >
            <Flex
              alignItems={"center"}
              gap={"12px"}
              h={"100%"}
              align={"center"}
            >
              <Image src={"/logo-icon.png"} alt={""} boxSize={"32px"} />
              <Box>
                <Text fontWeight={"700"}>MarkFlow</Text>
                <Text fontSize={"12px"}>Personal Utility</Text>
              </Box>
            </Flex>
          </Box>
          {children}
        </Providers>
      </body>
    </html>
  );
}
