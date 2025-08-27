"use client"
import Header from "@/components/header/page";
import Notifications from "@/app/notifications/page";
import { useState, createContext } from "react";

export const NotificationContext = createContext();
export default function Group_Layout({children}){
    let [open, setOpen] = useState(false);
    let [reloadKey, setReloadKey] = useState(0);
    const reloadNotifications = () => {
        setReloadKey(prev => prev + 1);
    };
    return (
        <NotificationContext.Provider value = {{reloadNotifications}}>
            <div>
                <Header setOpen={setOpen} open={open}/>
                <main className={ open ? "grid grid-cols-[60%_40%] transition-all duration-300 gap-4 p-4" : "p-4"}>
                    {children}
                    {open && <Notifications key={reloadKey}/>}
                </main>
            </div>
        </NotificationContext.Provider>
    );
}