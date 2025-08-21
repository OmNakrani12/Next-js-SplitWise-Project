import Header from "@/components/header/page";
import GroupList from "@/components/lists/page";
export default function Group_Layout({children}){
    return (
        <div>
            <div>
                <Header/>
                <main>{children}</main>
            </div>
        </div>
    );
}