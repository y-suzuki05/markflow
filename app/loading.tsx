import { Box, Skeleton } from "@chakra-ui/react";

export default function Loading() {
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
      <Skeleton height="8" width={{ base: "70%", md: "60" }} />
      <Box
        bg={"#fff"}
        border={"1px solid"}
        borderColor={"#E2E8F0"}
        borderRadius={"md"}
        mt={{ base: "5", md: "6" }}
        p={{ base: "5", md: "8" }}
      >
        <Skeleton height="7.5rem" />
      </Box>
    </Box>
  );
}
