"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CalendarIcon, ChevronDown, DollarSign, Loader2, StickyNote } from "lucide-react";
import { CoinSelector, type Coin } from "@/components/coin-selector";
import { addTransaction } from "../actions/transaction-actions";
import { cn } from "@/lib/utils";

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  defaultCoin?: Coin | null;
  onSuccess?: () => void;
}

type TxType = "BUY" | "SELL" | "TRANSFER";

export function TransactionModal({
  open,
  onOpenChange,
  userId,
  defaultCoin,
  onSuccess,
}: TransactionModalProps) {
  const [type, setType] = useState<TxType>("BUY");
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(defaultCoin ?? null);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [pricePerCoin, setPricePerCoin] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [fee, setFee] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultCoin) setSelectedCoin(defaultCoin);
  }, [defaultCoin]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setQuantity("");
      setPricePerCoin("");
      setFee("");
      setNotes("");
      setType("BUY");
    }
  }, [open]);

  const qty = parseFloat(quantity) || 0;
  const price = parseFloat(pricePerCoin) || 0;
  const feeAmt = parseFloat(fee) || 0;
  const total = qty * price + feeAmt;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoin) return toast.error("Please select a coin");
    if (qty <= 0) return toast.error("Please enter a valid quantity");
    if (price <= 0 && type !== "TRANSFER") return toast.error("Please enter price per coin");

    setLoading(true);
    const result = await addTransaction({
      userId,
      coinId: selectedCoin.id,
      coinSymbol: selectedCoin.symbol,
      coinName: selectedCoin.name,
      type,
      quantity: qty,
      pricePerCoin: price,
      date: new Date(date),
      fee: feeAmt,
      notes: notes || undefined,
    });

    if (result.success) {
      toast.success("Transaction added!");
      onSuccess?.();
      onOpenChange(false);
    } else {
      toast.error(result.error ?? "Failed to add transaction");
    }
    setLoading(false);
  };

  const tabs: TxType[] = ["BUY", "SELL", "TRANSFER"];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-border bg-card">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-xl font-bold">Add Transaction</DialogTitle>
          </DialogHeader>

          {/* Tab Switcher */}
          <div className="px-6 pt-4">
            <div className="flex rounded-lg bg-muted p-1 gap-1">
              {tabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    "flex-1 py-1.5 rounded-md text-sm font-semibold transition-all duration-200",
                    type === t
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
            {/* Coin Selector Button */}
            <button
              type="button"
              onClick={() => setSelectorOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-muted/60 border border-border hover:border-primary/50 hover:bg-muted/80 transition-all duration-200"
            >
              {selectedCoin ? (
                <div className="flex items-center gap-3">
                  {selectedCoin.logo ? (
                    <img src={selectedCoin.logo} alt={selectedCoin.symbol} className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                      {selectedCoin.symbol.substring(0, 2)}
                    </div>
                  )}
                  <span className="font-semibold">{selectedCoin.name}</span>
                  <span className="text-muted-foreground text-sm">{selectedCoin.symbol}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">Select a coin…</span>
              )}
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>

            {/* Quantity & Price */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quantity</Label>
                <Input
                  type="number"
                  step="0.00000001"
                  placeholder="0.00"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-muted/60 border-border"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price Per Coin</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    className="pl-7 bg-muted/60 border-border"
                    placeholder="0.00"
                    value={pricePerCoin}
                    onChange={(e) => setPricePerCoin(e.target.value)}
                    disabled={type === "TRANSFER"}
                    required={type !== "TRANSFER"}
                  />
                </div>
              </div>
            </div>

            {/* Date / Fee / Notes row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1 space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide sr-only">Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="datetime-local"
                    className="pl-8 text-xs bg-muted/60 border-border"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide sr-only">Fee</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Fee"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="pl-7 text-xs bg-muted/60 border-border"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide sr-only">Notes</Label>
                <div className="relative">
                  <StickyNote className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="pl-7 text-xs bg-muted/60 border-border"
                  />
                </div>
              </div>
            </div>

            {/* Total Spent */}
            <div className="rounded-lg bg-muted/60 border border-border px-4 py-3">
              <p className="text-xs text-muted-foreground mb-0.5">Total Spent</p>
              <p className="text-2xl font-bold tracking-tight">
                ${" "}
                <span>
                  {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </p>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full h-11 font-bold text-base" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Add Transaction"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <CoinSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        onSelectCoin={(coin) => setSelectedCoin(coin)}
      />
    </>
  );
}
