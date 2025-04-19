import { Container, Flex, Heading, Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <Theme>
          <Container size="3">
            <Flex direction="column" gap="4">
              <Flex align="center" gap="2" my="4">
                <img src="/logo.png" alt="Parcels" width={38} height={38} />
                <Heading size="5">Parcels</Heading>
              </Flex>

              <Outlet />
            </Flex>
          </Container>
          <Toaster richColors />
        </Theme>
      </QueryClientProvider>
    </>
  ),
});
