import { Credits } from "@/components/Credits";
import { ParcelsTable } from "@/components/ParcelsTable";
import { Box, Flex } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: async () => {
    if (!localStorage.getItem("password")) {
      return redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Box>
        <ParcelsTable />
      </Box>

      <Flex justify="end">
        <Credits />
      </Flex>
    </>
  );
}
