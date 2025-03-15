import Header from "@/components/layout/Header";
import OfferTable from "@/components/layout/OfferTable";
import OrdinalsGrid from "@/components/layout/OrdinalGrid";
import PortfolioStats from "@/components/layout/PortfolioStats";

export default function Home() {
  return (
    <div className="bg-[#000000] w-full h-[100%] px-23">
      <Header/>
      <PortfolioStats/>
      <OrdinalsGrid/>
      <OfferTable/>
    </div>
  );
}
