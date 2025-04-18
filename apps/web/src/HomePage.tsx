import { Credits } from "@/components/Credits";
import { ParcelsTable } from "@/components/ParcelsTable";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";

export function HomePage() {
  return (
    <Container size="3">
      <Flex direction="column" gap="4">
        <Flex align="center" gap="4" my="4">
          <img src="/logo.png" alt="Parcels" width={42} height={42} />
          <Heading size="5">Parcels</Heading>
        </Flex>

        <Box>
          <ParcelsTable />
        </Box>

        <Flex justify="end">
          <Credits />
        </Flex>
      </Flex>
    </Container>
  );
}
