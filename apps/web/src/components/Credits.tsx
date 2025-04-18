import { useGetCredits } from "@/lib/queries";
import { Code, Spinner, Text } from "@radix-ui/themes";

export function Credits() {
  const getCredits = useGetCredits();

  if (getCredits.isLoading) {
    return <Spinner />;
  }

  return (
    <Text size="2" color="gray">
      Usage: <Code>${getCredits.data?.totalUsage ? getCredits.data.totalUsage.toFixed(4) : "Unknown"}</Code>
    </Text>
  );
}
