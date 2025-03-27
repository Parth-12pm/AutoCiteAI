import Image from "next/image";

export const Logo = () => (
  <div className="flex flex-row gap-2">
    <Image src={"/globe.svg"} alt="Logo" width={20} height={20} />
    <p className=" font-bold">AutoCite-AI</p>
  </div>
);
