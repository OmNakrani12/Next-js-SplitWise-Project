"use client"
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { startOfWeek, startOfMonth, startOfYear, format } from "date-fns";

export default function Profile(){
    const [profileImage, setProfileImage] = useState(null);
    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [profilePhone, setProfilePhone] = useState("");
    const [nameEditing, setNameEditing] = useState(0);
    const [emailEditing, setEmailEditing] = useState(0);
    const [phoneEditing, setPhoneEditing] = useState(0);
    const fileInputRef = useRef(null);

    const [expenses, setExpenses] = useState([
        { amount: 200, date: "2025-09-01", type: "paid" },
        { amount: 100, date: "2025-09-01", type: "borrowed" },
        { amount: 50, date: "2025-09-06", type: "paid" },
        { amount: 300, date: "2025-08-20", type: "borrowed" },
        { amount: 500, date: "2025-01-15", type: "paid" }
    ]);
    const [filter, setFilter] = useState("week");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file){
            setProfileImage(URL.createObjectURL(file));
        }
    };
    
    const handleFetchExpenses = async () => {
        try{
            const res = await fetch("/api/expenses");
            const data = await res.json();
            setExpenses(data.allExpenses);
        }
        catch(error){
            console.log("Error :" + error);
        }
    }
    const handleSubmit = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (e.target.name === "name") {
                setProfileName(e.target.value);
            }
            else if (e.target.name === "email") {
                setProfileEmail(e.target.value);
            }
            else if (e.target.name === "phone") {
                setProfilePhone(e.target.value);
            }
        }
    }

    useEffect(() => {
        setProfileName(localStorage.getItem("name"));
        setProfileEmail(localStorage.getItem("email"));
        setProfileImage(localStorage.getItem("url"));
        handleFetchExpenses();
    },[])

    const getFilteredExpenses = () => {
        const today = new Date();

        if (filter === "day") {
            return expenses.filter(
                (e) => format(new Date(e.date), "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
            );
        }
        if (filter === "week") {
            const weekStart = startOfWeek(today);
            return expenses.filter((e) => new Date(e.date) >= weekStart);
        }
        if (filter === "month") {
            const monthStart = startOfMonth(today);
            return expenses.filter((e) => new Date(e.date) >= monthStart);
        }
        if (filter === "year") {
            const yearStart = startOfYear(today);
            return expenses.filter((e) => new Date(e.date) >= yearStart);
        }
        return expenses;
    };

    const filteredExpenses = getFilteredExpenses();

    const data = filteredExpenses.reduce((acc, exp) => {
        const key = filter === "year" ? format(new Date(exp.date), "MMM") : format(new Date(exp.date), "dd MMM");
        const existing = acc.find((d) => d.day === key);
        if (existing) {
            if (exp.type === "paid") {
                existing.paid += exp.amount;
            } else {
                existing.borrowed += exp.amount;
            }
        } else {
            acc.push({
                day: key,
                paid: exp.type === "paid" ? exp.amount : 0,
                borrowed: exp.type === "borrowed" ? exp.amount : 0
            });
        }
        return acc;
    }, []);

    return (
        <section className="mx-[10%] my-[5%] grid justify-center">
            <main>
                <h1 className="text-2xl font-bold">Your Account</h1>
                <br/>
                <div className="flex row gap-6">
                    <section>
                        <div className="w-32 h-32 relative m-4">
                            <Image src = { profileImage ? profileImage : "/imgs/profile_pic.jpg" } alt="My Photo" fill className="rounded-full object-cover border"/>
                            <button onClick={() => fileInputRef.current.click()} className="absolute bottom-1 right-2 bg-gray-400 rounded-full">
                                <Pencil className="text-white w-5 h-5 p-1"/>
                            </button>
                        </div>
                        <input type="file" accept="image/jpeg" ref={fileInputRef} onChange={handleFileChange} className="mb-4 hidden"/>
                    </section>

                    <section className="grid gap-y-3">
                        <label className="text-sm text-gray-500">Your name</label>
                        <div className="font-bold flex items-center min-h-6">
                            {
                                nameEditing ? (
                                    <div>
                                        <input type="text" onChange={(e) => setProfileName(e.target.value)} value={profileName} className="mb-4 px-3 focus:outline-none border-b border-gray-500 max-w-[50%]" placeholder="Enter the name" name="name"/>
                                        <button className="bg-blue-500 mx-2 px-2 py-1 hover:bg-blue-600 text-white rounded-md" onClick={() => setNameEditing(0)}>Save</button>
                                    </div>
                                ) : (
                                    <div>
                                        <label>{profileName || " None"}</label>
                                        <button className="pl-2" onClick={() => setNameEditing(1)}>
                                            <Pencil className="text-blue-500 w-4 h-4"/>
                                        </button>
                                    </div>
                                )
                            }
                        </div>

                        <label className="text-sm text-gray-500">Your email</label>
                        <div className="font-bold">
                            {
                                emailEditing ? (
                                    <div>
                                        <input type="text" onKeyDown={handleSubmit} onChange={(e) => setProfileEmail(e.target.value)} value={profileEmail} className="mb-4 px-3 focus:outline-none border-b border-gray-500 max-w-[50%]" placeholder="Enter the email" name="email"/>
                                        <button className="bg-blue-500 px-2 py-1 hover:bg-blue-600 text-white rounded-md ml-2" onClick={() => setEmailEditing(0)}>Save</button>
                                    </div>
                                ) : (
                                    <div>
                                        <label>{profileEmail || " None "}</label>
                                        <button className="pl-2" onClick={() => setEmailEditing(1)}>
                                            <Pencil className="text-blue-500 w-4 h-4"/>
                                        </button>
                                    </div>
                                )
                            }
                        </div>

                        <label className="text-sm text-gray-500">Your phone number</label>
                        <div className="font-bold">
                            {
                                phoneEditing ? (
                                    <div>
                                        <input type="text" onKeyDown={handleSubmit} onChange={(e) => {
                                            const newValue = e.target.value;
                                            if(/^\d*$/.test(newValue)){
                                                setProfilePhone(newValue);
                                            }
                                        }} value={profilePhone} className="mb-4 px-3 focus:outline-none border-b border-gray-500 max-w-[50%]" placeholder="Enter the phone" name="phone" inputMode="numeric" maxLength={10}/>
                                        <button className="bg-blue-500 px-2 py-1 hover:bg-blue-600 text-white rounded-md ml-2" onClick={() => setPhoneEditing(0)}>Save</button>
                                    </div>
                                ) : (
                                    <div>
                                        <label>{profilePhone || "None"}</label>
                                        <button className="pl-2" onClick={() => setPhoneEditing(1)}>
                                            <Pencil className="text-blue-500 w-4 h-4"/>
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    </section>
                </div>

                <div className="mt-10">
                    <h2 className="text-xl font-bold mb-4">Expense Tracker</h2>
                    <div className="mb-4">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border p-2 rounded-md"
                        >
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                        </select>
                    </div>
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="paid" fill="#22c55e" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="borrowed" fill="#ef4444" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[]}>
                                <XAxis />
                                <YAxis />
                                <text
                                    x="150"
                                    y="150"
                                    textAnchor="start"
                                    dominantBaseline="middle"
                                    className="fill-gray-500 text-lg"
                                >
                                    No expenses found
                                </text>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </main>
        </section>
    )
}
