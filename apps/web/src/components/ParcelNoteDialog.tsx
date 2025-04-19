import { Button, Dialog, Flex, TextArea } from "@radix-ui/themes";
import React from "react";

interface ParcelNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCancel: () => void;
  onSave: () => void;
  loading: boolean;
}

export function ParcelNoteDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onCancel,
  onSave,
  loading,
}: ParcelNoteDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="400px">
        <Dialog.Title>Parcel Note</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          View or edit the note for this parcel.
        </Dialog.Description>
        <TextArea value={value} onChange={onChange} placeholder="Parcel note" style={{ width: "100%" }} />
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" type="button" onClick={onCancel}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button type="button" onClick={onSave} loading={loading}>
            Save
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
