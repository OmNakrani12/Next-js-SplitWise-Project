"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Groups() {
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadGroups() {
      try {
        const res = await fetch("/api/groups", { method: "GET" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) setGroups(data.groups_data);
      } catch (e) {
        console.error("Failed to load groups:", e);
      }
    }
    loadGroups();
  }, []);
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: groupName.trim() }),
      });

      if (response.ok) {
        await response.json();
        // Refresh groups list to keep data shape consistent with GET response
        try {
          const res = await fetch("/api/groups", { method: "GET" });
          if (res.ok) {
            const latest = await res.json();
            if (latest.success) setGroups(latest.groups_data);
          }
        } catch (e) {
          console.error("Failed to refresh groups:", e);
        }
        setGroupName("");
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
          <form onSubmit={handleCreateGroup} className="space-y-4">
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
            </div>
            <button
              type="submit"
              disabled={loading || !groupName.trim()}
              className={`w-full px-6 py-3 text-white font-medium rounded-lg transition-colors ${
                loading || !groupName.trim()
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
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
  {groups && groups.length > 0 ? (
    groups.map((g, i) => (
      <li
        key={g._id || i}
        className="shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
      >
        <h2 className="text-xl text-black">
          {g.name}
        </h2>
      </li>
    ))
  ) : (
    <p className="col-span-full text-center text-gray-500 italic">
      No groups yet. Add one!
    </p>
  )}
</ul>
        </div>
      </div>
    </div>
  );
}