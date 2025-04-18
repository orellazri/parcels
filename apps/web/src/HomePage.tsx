import { Credits } from "@/components/Credits";
import { ParcelsTable } from "@/components/ParcelsTable";
import { Container, Flex, Heading } from "@radix-ui/themes";

export function HomePage() {
  return (
    <Container size="3">
      <Flex direction="column" gap="4" mt="6">
        <Heading size="5">Parcels</Heading>
        <ParcelsTable />
        <Flex justify="end">
          <Credits />
        </Flex>
      </Flex>
    </Container>
  );
}
