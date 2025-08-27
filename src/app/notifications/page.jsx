"use client"
import {useState, useEffect} from "react";
import NotificationBar from "@/components/notify/page";
import { Bell } from "lucide-react";
export default function Notifications({reloadKey}){
    const [notifications, setNotifications] = useState([]);
    async function fetchNotifications(){
        try{
            const res = await fetch('/api/notify', {method: "GET"});
            const data = await res.json();
            setNotifications(data.notifications || []);
            console.log("Notifications Fetched Successfully");
        }
        catch(e){
            console.error(e);
        }
    }
    useEffect(()=>{
        const load = async() => {
            await fetchNotifications();
        }
        load();
    },[reloadKey]);
    return <div>
        <div className="">
            {notifications && notifications.length > 0 ? (
                notifications.map((d, i)=>(
                    <NotificationBar key={i} name={d.name} email={d.email} id={d._id}/>
                ))) : (
                    <div className="flex justify-center items-center h-screen">
                        <div className="grid justify-center items-center">
                            <Bell width={72} height={72} className="mx-auto text-gray-500 my-4"/>
                            <h2 className="text-3xl text-gray-500 text-bold">No current notifications</h2>
                        </div>
                    </div>
                )
            }
        </div>
    </div>
}