"use client";

import FloatingHearts from "./components/FloatingHearts";
import Envelope from "./components/Envelope";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#F5E6E0] overflow-hidden">
      <FloatingHearts />
      <Envelope />
    </div>
  );
}
