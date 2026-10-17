import { TradeView } from "@/components/TradeView";
export default async function TradePage({ params }: { params: Promise<{ id: string }> }) { return <TradeView id={Number((await params).id)} />; }
