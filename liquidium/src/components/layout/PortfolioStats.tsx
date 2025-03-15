import PortfolioValueCard from "../modules/PortfolioValueCard";

export default function PortfolioStats() {
    return (
        <div className="mt-12 flex flex-row gap-2">
            <PortfolioValueCard
                title="Total portfolio value"
                btcValue={0.932223}
                usdValue={89932}
            />
            
            <PortfolioValueCard
                title="Total portfolio value"
                btcValue={0.932223}
                usdValue={89932}
            />
        </div>
    );
  }