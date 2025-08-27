"use client"
import Header from "@/components/header/page";
import { useState } from "react";
export default function NotificationsLayout({children}){
    let [open, setOpen] = useState(false);
    return (
        <div>
            <Header setOpen={setOpen}/>
            <main>{children}</main>
        </div>
    );
}