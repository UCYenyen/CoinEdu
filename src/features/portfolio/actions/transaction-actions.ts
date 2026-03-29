"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface TransactionInput {
  userId: string;
  coinId: string;
  coinSymbol: string;
  coinName?: string;
  type: "BUY" | "SELL" | "TRANSFER";
  quantity: number;
  pricePerCoin: number;
  date: Date;
  fee?: number;
  notes?: string;
}

export async function addTransaction(data: TransactionInput) {
  try {
    const transaction = await prisma.portfolioTransaction.create({
      data: {
        userId: data.userId,
        coinId: data.coinId,
        coinSymbol: data.coinSymbol,
        type: data.type,
        quantity: data.quantity,
        pricePerCoin: data.pricePerCoin,
        date: data.date,
        fee: data.fee || 0,
        notes: data.notes,
      },
    });

    revalidatePath("/portfolio");
    revalidatePath(`/coin/${data.coinSymbol.toLowerCase()}`);
    return { success: true, transaction };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Failed to add transaction:", msg);
    return { success: false, error: `DB error: ${msg}` };
  }
}

export async function deleteTransaction(txId: string) {
  try {
    const tx = await prisma.portfolioTransaction.delete({
      where: { id: txId }
    });
    revalidatePath("/portfolio");
    revalidatePath(`/coin/${tx.coinSymbol.toLowerCase()}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    return { success: false, error: "Failed to delete" };
  }
}

export async function getPortfolioHoldings(userId: string) {
  try {
    const transactions = await prisma.portfolioTransaction.findMany({
      where: { userId },
      orderBy: { date: 'asc' }
    });

    const holdingsMap = new Map<string, {
      coinId: string;
      coinSymbol: string;
      totalQuantity: number;
      totalSpent: number;
    }>();

    for (const tx of transactions) {
      const current = holdingsMap.get(tx.coinId) || {
        coinId: tx.coinId,
        coinSymbol: tx.coinSymbol,
        totalQuantity: 0,
        totalSpent: 0,
      };

      if (tx.type === "BUY") {
        current.totalQuantity += tx.quantity;
        current.totalSpent += (tx.quantity * tx.pricePerCoin) + tx.fee;
      } else if (tx.type === "SELL") {
        if (current.totalQuantity > 0) {
          const avgCost = current.totalSpent / current.totalQuantity;
          current.totalQuantity -= tx.quantity;
          current.totalSpent -= tx.quantity * avgCost;
        } else {
          current.totalQuantity -= tx.quantity;
        }
      } else if (tx.type === "TRANSFER") {
        current.totalQuantity += tx.quantity;
      }

      holdingsMap.set(tx.coinId, current);
    }

    const holdings = Array.from(holdingsMap.values())
      .filter(h => h.totalQuantity > 0.00000001) // ignore dust
      .map(h => ({
        ...h,
        avgBuyPrice: h.totalQuantity > 0 ? h.totalSpent / h.totalQuantity : 0
      }));

    return { success: true, holdings, transactions };
  } catch (error) {
    console.error("Failed to get holdings:", error);
    return { success: false, holdings: [], transactions: [] };
  }
}
