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
        <DialogContent className="fixed top-[5vh] left-1/2 -translate-x-1/2 h-[95vh] w-full max-w-[95vw] sm:max-w-[90vw] translate-y-0 rounded-[25px] border border-[#2B2B2B] bg-[#111111] p-0">
            <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6">
                <div 
                    className="w-12 h-1.5 bg-[#2B2B2B] rounded-full mx-auto cursor-pointer hover:bg-[#3B3B3B] transition-colors" 
                    onClick={() => onOpenChange(false)}
                />
                <DialogTitle className="text-lg sm:text-xl font-bold text-white text-center">
                    All Ordinals
                </DialogTitle>
                
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 overflow-y-auto max-h-[calc(95vh-100px)] p-2 sm:p-4 place-items-center">
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