import Header from "@/components/header/page";
export default function profileLayout({children}){
    return (
        <div>
            <main>
                <Header/>
                {children}
            </main>
        </div>
    )
}