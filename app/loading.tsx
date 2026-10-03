import { Box, Skeleton } from "@chakra-ui/react";

export default function Loading() {
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
      <Skeleton height="32px" width={{ base: "70%", md: "240px" }} />
      <Box
        bg={"#fff"}
        border={"1px solid"}
        borderColor={"#E2E8F0"}
        borderRadius={"md"}
        mt={{ base: "20px", md: "24px" }}
        p={{ base: "20px", md: "32px" }}
      >
        <Skeleton height="120px" />
      </Box>
    </Box>
  );
}
