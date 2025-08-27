"use client";

export default function NotificationBar({ email, name, id}) {
  let handleSuccess = async() => {
    try{
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      console.log("Group Created Successfully");
      handleRemove();
    }
    catch(e){
      console.error("Error creating group:", e);
      alert("Failed to accept request!");
    }
  }
  let handleRemove = async() => {
    try{
      const response = await fetch(`/api/notify/${id}`, {method: "DELETE"});
      if (response.ok) {
        console.log("Request declined successfully");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Failed to decline request:", errorData.error);
        alert(`Failed to decline request: ${errorData.error || "Unknown error"}`);
      }
    }
    catch(e){
      console.error("Error declining request:", e);
      alert("Failed to decline request! Please try again.");
    }
  }
  return (
    <div className="bg-white text-gray-700 p-4 shadow-md rounded-2xl shadow-gray-300 items-center">
      <div className="grid mb-3">
        <h2 className="text-xl font-bold">{name}</h2>
        <h1 className="text-sm">{email}</h1>
      </div>

        <div className="flex gap-2 justify-end">
          <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg" onClick={handleRemove}>
            Decline
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg" onClick={handleSuccess}>
            Accept
          </button>
        </div>
    </div>
  );
}
