import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold underline text-center">
          Banco JAM, como mermelada — Jordan, Mariangel y Allan
        </h1>
        <Image
          src="/jam.png"
          alt="Logo JAM"
          width={50}
          height={50}
        />
      </div>
    </div>
  );
}
