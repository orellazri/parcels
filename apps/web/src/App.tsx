import { HomePage } from "@/HomePage";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme>
        <HomePage />
        <Toaster richColors />
      </Theme>
    </QueryClientProvider>
  );
}
