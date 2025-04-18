import { useRefreshParcels } from "@/lib/queries";
import { IconButton } from "@radix-ui/themes";
import { IconRefresh } from "@tabler/icons-react";
import { toast } from "sonner";

export function RefreshButton() {
  const refreshParcels = useRefreshParcels();

  async function refresh() {
    const { numCreated } = await refreshParcels.mutateAsync();

    if (numCreated > 0) {
      toast.success(`Found ${numCreated} new parcel${numCreated > 1 ? "s" : ""}`);
    } else {
      toast.info("No new parcels found");
    }
  }

  return (
    <>
      <IconButton variant="soft" onClick={refresh} loading={refreshParcels.isPending}>
        <IconRefresh size={16} />
      </IconButton>
    </>
  );
}
