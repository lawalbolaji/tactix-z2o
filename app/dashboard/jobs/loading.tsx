import Image from "next/image";

export default function LoadingPage() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div>
                <Image src={"/loader.gif"} height={64} width={64} alt="loading" unoptimized />
            </div>
        </div>
    );
}
