import { useCreateParcel } from "@/lib/queries";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { toast } from "sonner";

export function CreateParcelDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [store, setStore] = useState("");
  const createParcel = useCreateParcel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createParcel.mutateAsync({ name, store });
      toast.success("Parcel created");
      setOpen(false);
      setName("");
      setStore("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unknown error");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button>Create Parcel</Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="400px">
        <Dialog.Title>Create Parcel</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Enter the parcel details below.
        </Dialog.Description>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Root
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Parcel name"
                required
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Store
              </Text>
              <TextField.Root
                value={store}
                onChange={(e) => setStore(e.target.value)}
                placeholder="Store name"
                required
              />
            </label>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" type="button">
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" loading={createParcel.status === "pending"}>
              Create
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
