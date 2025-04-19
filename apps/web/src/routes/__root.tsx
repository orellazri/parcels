import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <Theme>
          <Outlet />
          <Toaster richColors />
        </Theme>
      </QueryClientProvider>
    </>
  ),
});
