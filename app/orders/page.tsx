"use client";

import { useEffect, useState } from "react";
import apiFetch from "../lib/request";
import TopBar from "../component/dashboard/TopBar";
import Footer from "../component/dashboard/Footer";

type Order = {
  _id: string;
  items: Array<{ name: string; quantity: number; unitPricePaisa: number }>;
  totalAmountPaisa: number;
  currency: string;
  status: string;
  providerTransactionId?: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("Loading orders…");

  useEffect(() => {
    void apiFetch("/api/payment/orders")
      .then(async response => ({ response, body: await response.json().catch(() => ({})) }))
      .then(({ response, body }) => {
        if (!response.ok) return setMessage(body.message || "Unable to load orders.");
        setOrders(Array.isArray(body.orders) ? body.orders : []);
        setMessage("");
      })
      .catch(() => setMessage("Unable to load orders."));
  }, []);

  return <>
    <TopBar />
    <main className="mx-auto min-h-[70vh] max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">My Orders</h1>
      {message && <p>{message}</p>}
      {!message && orders.length === 0 && <p>You have no orders yet.</p>}
      <div className="space-y-4">
        {orders.map(order => <article key={order._id} className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <strong>Order {order._id}</strong>
            <span className="capitalize">{order.status.replaceAll("_", " ")}</span>
          </div>
          <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleString()}</p>
          <ul className="my-3 list-inside list-disc">
            {order.items.map((item, index) =>
              <li key={`${order._id}-${index}`}>{item.name} × {item.quantity}</li>)}
          </ul>
          <p className="font-semibold">NPR {(order.totalAmountPaisa / 100).toFixed(2)}</p>
          {order.providerTransactionId && <p className="text-sm">Transaction: {order.providerTransactionId}</p>}
        </article>)}
      </div>
    </main>
    <Footer />
  </>;
}
