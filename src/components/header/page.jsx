import Image from "next/image"
export default function Header(){
    return <div className="flex justify-between items-center">
        <ul className="flex gap-4">
            <li>{process.env.EMAIL}</li>
        </ul>
        <Image src={process.env.URL} alt="Pic" width={60} height={60} className="rounded-full"/>
    </div>
}