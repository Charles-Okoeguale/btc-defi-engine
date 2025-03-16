import OrdinalCard from "@/components/modules/OrdinalCard"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Ordinal, OrdinalsBottomSheetProps } from "@/types"

export function OrdinalsBottomSheet({
  isOpen,
  onOpenChange,
  ordinals,
  floorPrices,
  onCreateOffer
}: OrdinalsBottomSheetProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="xl:fixed xl:top-[5vh] xl:left-1/2 xl:-translate-x-1/2 xl:h-[95vh] xl:w-full xl:max-w-[90vw] xl:translate-y-0 xl:rounded-[25px] xl:border xl:border-[#2B2B2B] xl:bg-[#111111] xl:p-0">
        <div className="xl:flex xl:flex-col xl:gap-4 xl:p-6">
            <div className="xl:w-12 xl:h-1.5 xl:bg-[#2B2B2B] xl:rounded-full xl:mx-auto" />
            <DialogTitle className="xl:text-xl xl:font-bold xl:text-white">
                All Ordinals
            </DialogTitle>
            <div className="xl:grid xl:grid-cols-4 xl:gap-4 xl:overflow-y-auto xl:max-h-[calc(95vh-120px)] xl:p-4">
            {ordinals.map((ordinal: Ordinal) => (
                <OrdinalCard
                key={ordinal.inscription_id}
                ordinal={ordinal}
                floorPrice={Number((floorPrices[ordinal.slug] || 0).toFixed(4))}
                onCreateOffer={() => onCreateOffer(ordinal)}
                />
            ))}
            </div>
        </div>
        </DialogContent>
    </Dialog>
  )
}