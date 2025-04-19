import { useRefreshParcels } from "@/lib/queries";
import { IconButton } from "@radix-ui/themes";
import { IconRefresh } from "@tabler/icons-react";
import { toast } from "sonner";

export function RefreshButton() {
  const refreshParcels = useRefreshParcels();

  async function refresh() {
    toast.promise(refreshParcels.mutateAsync, {
      loading: "Refreshing parcels...",
      success: (data) => `Found ${data.numCreated} new parcel${data.numCreated > 1 ? "s" : ""}`,
      error: "Failed to refresh parcels",
    });
  }

  return (
    <>
      <IconButton variant="soft" onClick={refresh} loading={refreshParcels.isPending}>
        <IconRefresh size="16" />
      </IconButton>
    </>
  );
}
