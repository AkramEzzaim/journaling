import { EditEntryLoader } from "@/components/EditEntryLoader";

export default async function EditEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditEntryLoader id={Number(id)} />;
}
