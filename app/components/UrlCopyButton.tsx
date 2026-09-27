"use client";
import { Button } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

type UrlCopyButtonProps = {
  url: string;
};

export default function UrlCopyButton({ url }: UrlCopyButtonProps) {
  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      toaster.create({
        title: "URLをコピーしました",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      toaster.create({
        title: "URLのコピーに失敗しました",
        type: "error",
      });
    }
  }

  return (
    <Button
      px={"16px"}
      variant={"outline"}
      size={"lg"}
      fontWeight={700}
      onClick={() => copyUrl()}
    >
      URLをコピー
    </Button>
  );
}
