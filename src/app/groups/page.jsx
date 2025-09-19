"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { NotificationContext } from "@/app/groups/layout";
import Transactions from "@/app/transactions/[name]/page";

export default function Groups() {
  const { reloadNotifications } = useContext(NotificationContext);
  const [groupName, setGroupName] = useState("");
  const [joinEmail, setJoinEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [openName, setOpenName] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupTotal, setGroupTotal] = useState([]);
  const router = useRouter();

  let testEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  async function loadGroups() {
    try {
      const res = await fetch("/api/groups", { method: "GET" });
      if (!res.ok) return;
      const data = await res.json();
      console.log(data);
      if (data.success){
        setGroups(data.groups_data.groups);
        setGroupTotal(data.groups_data.group_total);
        console.log(data.groups_data.group_total);
      };
      console.log(groups)
    } catch (e) {
      console.error("Failed to load groups:", e);
    }
  }
  useEffect(() => {
    loadGroups();
  }, []);
  const handleCreateNotification = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }
    if (!groupName.trim()) {
      alert("Please enter a email");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: groupName.trim(), email: joinEmail.trim() }),
      });

      if (response.ok) {
        await response.json();
        await loadGroups();
        reloadNotifications();
        setGroupName("");
        setJoinEmail("");
      } else {
        const errorData = await response.json();
        alert(`Error creating group: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Group</h1>
          <form onSubmit={handleCreateNotification} className="space-y-4">
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <br />
              <br />
              <input
                type="text"
                id="joinEmail"
                value={joinEmail}
                onChange={(e) => setJoinEmail(e.target.value)}
                placeholder="Enter email id..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !groupName.trim()}
              className={`w-full px-6 py-3 text-white font-medium rounded-lg transition-colors ${
                loading || !groupName.trim() || !testEmail(joinEmail.trim())
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Groups</h2>
          <ul className="grid grid-cols-1 gap-6 mt-6">
            {groups && groups.length > 0 ? (
              groups.map((g, i) => {
                const displayName = typeof g === "string" ? g.replace(/^group_/, "") : g?.name || "";
                const key = (typeof g === "string" ? g : g?._id) || i;
                const expense = typeof groupTotal[i] === "number" ? parseFloat(groupTotal[i]).toFixed(2) : 0;
                return (
                  <li
                    key={key}
                    onClick={() => {
                      setOpen(true);
                      setOpenName(displayName)
                    }}
                    className="grid justify-between shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    <h2 className="text-xl text-gray-500">
                      {displayName}
                    </h2>
                    <div className="text-start">
                      {
                        expense < 0 ? (
                          <>
                            <h3 className="text-red-500">You owe {parseFloat(expense * -1).toFixed(2)}</h3>
                          </>
                        ) : (
                          <>
                            {expense == 0 ? (
                              <h3 className="text-gray-500">Settled Up</h3>
                            ) : (
                              <h3 className="text-green-500">You are owed {expense}</h3>
                            )}
                          </>
                        )
                      }
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-500 italic">
                No groups yet. Add one!
              </p>
            )}
          </ul>
        </div>
      </div>
      { open && (
        <div className = {open ? "fixed inset-0 bg-black/25 flex items-center justify-center z-50" : ""} onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Transactions name={openName} onClose={() => setOpen(false)} />
          </div>
        </div>
        )
      }
    </div>
  );
}