"use client";
import { useState } from "react";

export default function AddExpenseDialog({groupName}) {
  const [open, setOpen] = useState(true);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentType, setPaymentType] = useState("paid");

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const res = fetch(`/api/transactions/${groupName}`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify({
          category,
          amount,
          paid: paymentType === "paid"
        }),
      });
      const data = await res.json();
      if(!res.ok){
        throw new Error(data.error || "Something went Wrong");
      }
      console.log("Success to post data to server");
    }
    catch(error){
      console.log("Error : Error during while sending data to server");
    }
    setOpen(false);
  };

  return (
    <div className="p-6">
      {open && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">You paid or borrowed</label>
                <select
                id="paymentType"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="paid">You Paid</option>
                <option value="borrowed">You Borrowed</option>
              </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
