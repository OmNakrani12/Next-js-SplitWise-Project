"use client"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddExpensePage from "@/app/transactions/[name]/add_expense/page";
export default function Transactions({name}){
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const fetchTransactions = async() => {
        const res = await fetch(`/api/transactions/${name}`,{
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        });
        const data = await res.json();
        setTransactions(data.content);
        console.log(data);
    }
    useEffect(()=>{
        if(name){
            fetchTransactions();
        }
    },[name]);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ amount, category });
        setOpen(false);
    };
    return (
        <div className="fixed inset-0 bg-black/25 flex items-end justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[50%] h-[90%] mb-4">
                <section className="flex justify-between bg-gray-200 p-3 w-[100%]">
                    <ul className="flex gap-2">
                        <li></li>
                        <li className="font-bold text-2xl">{name}</li>
                    </ul>
                    <div className="flex gap-3">
                        <button className="bg-red-500 text-white bold rounded-md px-4 py-2 hover:bg-red-600" onClick={() => setOpen(true)}>Add expense</button>
                        <button className="bg-green-500 text-white bold rounded-md px-4 py-2 hover:bg-green-600">Settle up</button>
                    </div>
                </section>
                <main className="grid grid-cols-1 gap-4 mt-6 overflow-y-scroll h-[80%]">
                    {
                        transactions.length >= 1 ? (
                            <ul className="">
                                {transactions.map((t, i) => {
                                    return (
                                        <li key={i}
                                        className="flex justify-between items-center shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1 h-[80px] my-2"
                                        >
                                            <div>
                                                <h2 className="text-xl text-gray-700 font-semibold">
                                                    {t.title}
                                                </h2>
                                                {
                                                    t.paid ? (
                                                        <h6 className="text-gray-500">you paid {t.expense}</h6>
                                                    ) : (
                                                        <h6 className="text-gray-500">{localStorage.getItem("email")} paid {t.expense}</h6>
                                                    )
                                                }
                                            </div>
                                            <div>
                                                {
                                                    t.paid ? (
                                                        <h6 className="text-green-500 ">you lent</h6>
                                                    ) : (
                                                        <h6 className="text-red-500 text-center">you borrowed</h6>
                                                    )
                                                }
                                                <h5 className="text-sm text-gray-500 text-center">₹{parseFloat(t.expense).toFixed(2)}</h5>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : (
                            <p className="col-span-full text-center text-gray-500 italic">
                                Add Expense
                            </p>
                        )
                    }
                </main>
            </div>
            {open && (
                <div className="flex items-end justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[50%] h-[90%] mb-4">
                        <AddExpensePage groupName={name} onClose={() => setOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    )
}