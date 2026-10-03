import { Box, Skeleton } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Box w="full" maxW="760px" mx="auto" my="48px" px="4">
      <Skeleton height="32px" width="240px" />
      <Box
        bg={"#fff"}
        border={"1px solid"}
        borderColor={"#E2E8F0"}
        borderRadius={"md"}
        mt={"24px"}
        p={"32px"}
      >
        <Skeleton height="120px" />
      </Box>
    </Box>
  );
}