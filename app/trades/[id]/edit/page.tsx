import { TradeForm } from "@/components/TradeForm";
export default async function EditTradePage({ params }: { params: Promise<{ id: string }> }) { return <TradeForm id={Number((await params).id)} />; }
