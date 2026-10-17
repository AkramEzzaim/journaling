import { Plus } from "lucide-react";
import Link from "next/link";
import { TradeTable } from "@/components/TradeTable";
export default function TradesPage() { return <div className="page"><header className="page-header split-header"><div><span className="eyebrow">Execution log</span><h1>Trades</h1><p>Every position, plan and outcome in one place.</p></div><Link href="/new" className="button primary"><Plus size={15} />New trade</Link></header><TradeTable /></div>; }
