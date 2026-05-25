import { Catalog } from "@/components/home/Catalog";
import { Complements } from "@/components/home/Complements";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Principles } from "@/components/home/Principles";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Principles />
      <Catalog />
      <Complements />
      <CtaFinal />
    </>
  );
}
