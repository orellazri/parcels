import { CreateParcelDialog } from "@/components/CreateParcelDialog";
import { DataTable } from "@/components/DataTable";
import { ParcelNoteDialog } from "@/components/ParcelNoteDialog";
import { RefreshButton } from "@/components/RefreshButton";
import { formatDate } from "@/lib/date";
import { useDeleteParcel, useListParcels, useRegenerateParcel, useUpdateParcel } from "@/lib/queries";
import { ParcelResponseDto } from "@parcels/common";
import { Badge, DropdownMenu, Flex, IconButton, Text, TextField, Tooltip } from "@radix-ui/themes";
import {
  IconCheck,
  IconDots,
  IconEyeCheck,
  IconEyeX,
  IconNote,
  IconPencil,
  IconRotate,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { memo, useRef, useState } from "react";
import { toast } from "sonner";

const EditableCell = memo(function EditableCell({
  initialValue,
  isEditing,
  onSave,
  placeholder,
  onEnterKeyPress,
}: {
  initialValue: string;
  isEditing: boolean;
  onSave: (value: string) => void;
  placeholder: string;
  onEnterKeyPress: () => void;
}) {
  const [value, setValue] = useState(initialValue);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSave(value);
      onEnterKeyPress();
    }
  };

  if (isEditing) {
    return (
      <TextField.Root
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => onSave(value)}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <Tooltip content={initialValue}>
      <Text>{initialValue.length > 50 ? `${initialValue.slice(0, 50)}...` : initialValue}</Text>
    </Tooltip>
  );
});

export function ParcelsTable() {
  const [editingParcelId, setEditingParcelId] = useState<number | null>(null);
  const [showReceived, setShowReceived] = useState(false);
  const editedValuesRef = useRef<Record<string, string>>({});
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notesDialogParcel, setNotesDialogParcel] = useState<ParcelResponseDto | null>(null);
  const [notesValue, setNotesValue] = useState("");

  const listParcels = useListParcels(showReceived);
  const updateParcel = useUpdateParcel();
  const deleteParcel = useDeleteParcel();
  const regenerateParcel = useRegenerateParcel();

  const saveParcel = async (id: number) => {
    try {
      const values = editedValuesRef.current;
      await updateParcel.mutateAsync({
        id,
        payload: {
          name: values.name,
          store: values.store,
        },
      });
      setEditingParcelId(null);
      editedValuesRef.current = {};
      toast.success("Parcel updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unknown error");
    }
  };

  const cancelEditing = () => {
    setEditingParcelId(null);
    editedValuesRef.current = {};
  };

  const handleFieldChange = (field: string, value: string) => {
    editedValuesRef.current[field] = value;
  };

  const openNotesDialog = (parcel: ParcelResponseDto) => {
    setNotesDialogParcel(parcel);
    setNotesValue(parcel.note ?? "");
    setNotesDialogOpen(true);
  };
  const closeNotesDialog = () => {
    setNotesDialogOpen(false);
    setNotesDialogParcel(null);
    setNotesValue("");
  };
  const handleSaveNotes = async () => {
    if (!notesDialogParcel) return;
    try {
      await updateParcel.mutateAsync({ id: notesDialogParcel.id, payload: { note: notesValue } });
      toast.success("Notes updated");
      closeNotesDialog();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unknown error");
    }
  };

  const columns: ColumnDef<ParcelResponseDto>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const parcel = row.original;
        const isEditing = editingParcelId === parcel.id;

        return (
          <EditableCell
            initialValue={parcel.name}
            isEditing={isEditing}
            onSave={(value) => handleFieldChange("name", value)}
            placeholder="Name"
            onEnterKeyPress={async () => await saveParcel(parcel.id)}
          />
        );
      },
    },
    {
      accessorKey: "store",
      header: "Store",
      cell: ({ row }) => {
        const parcel = row.original;
        const isEditing = editingParcelId === parcel.id;

        return (
          <EditableCell
            initialValue={parcel.store ?? "Unknown"}
            isEditing={isEditing}
            onSave={(value) => handleFieldChange("store", value)}
            placeholder="Store"
            onEnterKeyPress={async () => await saveParcel(parcel.id)}
          />
        );
      },
    },
    {
      accessorKey: "received",
      header: "Status",
      cell: ({ row }) => {
        const parcel = row.original;
        return <Badge color={parcel.received ? "green" : "gray"}>{parcel.received ? "Received" : "Waiting"}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row }) => {
        const parcel = row.original;
        return <Text>{formatDate(parcel.createdAt)}</Text>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const parcel = row.original;
        return editingParcelId === parcel.id ? (
          <EditingButtons onSave={async () => await saveParcel(parcel.id)} onCancel={cancelEditing} />
        ) : (
          <Flex gap="3" justify="end">
            <IconButton variant="ghost" color={parcel.note ? "blue" : "gray"} onClick={() => openNotesDialog(parcel)}>
              <IconNote size={16} />
            </IconButton>

            <EditParcelButton
              parcel={parcel}
              onEdit={() => setEditingParcelId(parcel.id)}
              onToggleReceived={async () => {
                try {
                  await updateParcel.mutateAsync({ id: parcel.id, payload: { received: !parcel.received } });
                  toast.success("Parcel updated");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Unknown error");
                }
              }}
              onDelete={async () => {
                try {
                  await deleteParcel.mutateAsync(parcel.id);
                  toast.success("Parcel deleted");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Unknown error");
                }
              }}
              onRegenerate={async () => {
                toast.promise(regenerateParcel.mutateAsync(parcel.id), {
                  loading: "Regenerating parcel...",
                  success: "Parcel regenerated",
                  error: "Failed to regenerate parcel",
                });
              }}
            />
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      <ParcelNoteDialog
        open={notesDialogOpen}
        onOpenChange={setNotesDialogOpen}
        value={notesValue}
        onChange={(e) => setNotesValue(e.target.value)}
        onCancel={closeNotesDialog}
        onSave={handleSaveNotes}
        loading={updateParcel.status === "pending"}
      />
      <Flex direction="column" gap="4">
        <DataTable
          columns={columns}
          data={listParcels.data || []}
          pageSize={10}
          defaultSorting={[{ id: "createdAt", desc: true }]}
          leftSection={
            <Text size="2">
              <Flex gap="2" align="center">
                <IconButton
                  variant="ghost"
                  color={showReceived ? "blue" : "gray"}
                  onClick={() => setShowReceived(!showReceived)}
                >
                  {showReceived ? <IconEyeCheck size={18} /> : <IconEyeX size={18} />}
                </IconButton>
              </Flex>
            </Text>
          }
          rightSection={
            <Flex justify="end" align="center" gap="2">
              <CreateParcelDialog />
              <RefreshButton />
            </Flex>
          }
        />
      </Flex>
    </>
  );
}

function EditParcelButton({
  parcel,
  onEdit,
  onToggleReceived,
  onDelete,
  onRegenerate,
}: {
  parcel: ParcelResponseDto;
  onEdit: (parcel: ParcelResponseDto) => void;
  onToggleReceived: (parcel: ParcelResponseDto) => void;
  onDelete: (id: number) => void;
  onRegenerate: (parcel: ParcelResponseDto) => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" color="gray">
          <IconDots size={16} />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => onToggleReceived(parcel)}>
          {parcel.received ? (
            <>
              <IconX size={16} />
              Not Received
            </>
          ) : (
            <>
              <IconCheck size={16} />
              Received
            </>
          )}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => onEdit(parcel)}>
          <IconPencil size={16} />
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => onRegenerate(parcel)}>
          <IconRotate size={16} />
          Regenerate
        </DropdownMenu.Item>
        <DropdownMenu.Item color="red" onClick={() => onDelete(parcel.id)}>
          <IconTrash size={16} />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function EditingButtons({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <Flex gap="3" justify="end">
      <IconButton variant="ghost" color="green" onClick={onSave}>
        <IconCheck size={16} />
      </IconButton>
      <IconButton variant="ghost" color="red" onClick={onCancel}>
        <IconX size={16} />
      </IconButton>
    </Flex>
  );
}
