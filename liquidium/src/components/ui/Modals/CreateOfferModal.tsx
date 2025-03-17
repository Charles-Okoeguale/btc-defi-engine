import { FC, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ScanLine, Info } from 'lucide-react';
import { CreateOfferModalProps } from '@/types';
import Image from 'next/image';
import { AdvancedInputWithLabel } from '../InputWithLabel';
import PriceTag from '@/components/modules/PriceTag';
import { BTC_PRICE_USD, MOCK_USER_BALANCE, MOCK_USER_ID } from "@/constants";
import { calculateInterest, calculateRates } from '@/lib/financial';

export const CreateOfferModal: FC<CreateOfferModalProps> = ({
  isOpen,
  onOpenChange,
  ordinalData,
  onSubmit,
}) => {
    const [amount, setAmount] = useState<string>('0');
    const [term, setTerm] = useState<string>('0');
    const [interest, setInterest] = useState<string>('0');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const amountValue = amount ? parseFloat(amount) : null;
    const termValue = term ? parseInt(term) : null;
    const interestValue = interest ? parseFloat(interest) : null;
    const amountUSD = amountValue !== null ? amountValue * BTC_PRICE_USD : null;

    const displayAmount = amount === '0' ? '' : amount;
    const displayTerm = term === '0' ? '' : term;
    const displayInterest = interest === '0' ? '' : interest;

    const { totalInterestBTC, totalInterestUSD } = calculateInterest(
        amountValue,
        interestValue,
        termValue
    );
      
    const { apr, apy } = calculateRates(interestValue, termValue);

  const isFormValid = amountValue !== null && termValue !== null && interestValue !== null;

  const handleSubmit = async () => {
    if (isFormValid) {
      setIsSubmitting(true);
      setError(null);
      
      try {
        onSubmit({
          amount: amountValue!,
          term: termValue!,
          interest: interestValue!,
          ordinalId: ordinalData.inscription_id,
          userId: MOCK_USER_ID 
        });
        resetForm();
        onOpenChange(false);
      } catch (err) {
        setError("Failed to create request. Please try again.");
        console.error("Submission error:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setAmount('0');
    setTerm('0');
    setInterest('0');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-40" />
        <DialogContent className="bg-[#0A0A0A] text-white border border-[#2B2B2B] p-4 sm:p-6 
            w-[90%] 
            sm:w-[500px] 
            md:w-[600px] 
            lg:w-[600px] 
            max-h-[85vh] 
            overflow-y-auto 
            fixed 
            top-[50%] 
            left-[50%] 
            -translate-x-[50%] 
            -translate-y-[50%]
            !m-0
            scrollbar-thin 
            scrollbar-thumb-[#2B2B2B] 
            scrollbar-track-transparent
            z-50">
            <div className='border border-[#4B4B4B] rounded-[20px] p-3 sm:p-4 bg-[#0A0A0A]'>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="font-bold text-[14px] sm:text-[16px]">
                        Create a custom request
                    </DialogTitle>
                    
                    <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
                        {/* Image container */}
                        <div className='flex justify-center sm:w-[100px]'>
                            <div className="relative w-[80px] sm:w-[100px] h-[60px] sm:h-[70px]">
                                <div className="absolute inset-0 rounded-[10px] overflow-hidden">
                                    <Image
                                        src={ordinalData.render_url || '/liquid.jpg'}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Details container */}
                        <div className='flex-1 space-y-2'>
                            <div className="flex justify-between">
                                <span className="text-[#7D7D7D] text-[12px]">Collection:</span>
                                <span className="text-white text-[12px]">{ordinalData.collection_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#7D7D7D] text-[12px]">Name:</span>
                                <span className="text-white text-[12px]">{ordinalData.inscription_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#7D7D7D] text-[12px]">Ordinal id:</span>
                                <span className="text-white text-[12px]">
                                    {ordinalData.inscription_id.substring(0, 4)}...{ordinalData.inscription_id.substring(ordinalData.inscription_id.length - 8)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#7D7D7D] text-[12px]">insc number:</span>
                                <span className="text-white text-[12px]">{ordinalData.inscription_number}</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* View button */}
                <div 
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-[#2B2B2B] rounded-[10px] cursor-pointer hover:bg-[#2B2B2B]/10 transition-colors mt-4"
                    onClick={() => window.open(`https://ordinals.com/inscription/${ordinalData.inscription_id}`, '_blank')}
                >
                    <ScanLine className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">View</span>
                </div>

                {/* Loan terms section */}
                <div className="mt-8">
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-white bg-[#FF5700] rounded-[10px]" /> 
                        <h5 className="text-white text-[14px]">Set loan terms</h5>
                    </div>
                    
                    <div className='mt-4 space-y-4'>
                        {/* Term input */}
                        <div>
                            <p className='flex items-center text-[13px]'>
                                Term <Check className="w-3 h-3 text-white ml-1" />
                            </p>
                            <AdvancedInputWithLabel
                                value={displayTerm}
                                onChange={(value) => setTerm(value || '0')}
                                placeholder=""
                                rightLabel="Days"
                            />
                        </div>

                        {/* Amount section */}
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                            <div className='flex items-center gap-4'>
                                <div>
                                    <p className='flex items-center gap-1 mb-2 text-[13px]'>
                                        Amount <Check className="w-3 h-3 text-white" />
                                    </p>
                                    <AdvancedInputWithLabel
                                        value={displayAmount}
                                        onChange={(value) => setAmount(value || '0')}
                                        placeholder=""
                                        rightLabel="₿"
                                    />
                                </div>
                                {amountUSD !== null && (
                                    <p className='text-[grey] text-[12px]'>${amountUSD.toFixed(2)}</p>
                                )}
                            </div>
                            <PriceTag 
                                label="Bal" 
                                value={`₿ ${MOCK_USER_BALANCE.toFixed(5)}`} 
                            />
                        </div>

                        {/* Interest section */}
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                            <div className='flex items-center gap-4'>
                                <div>
                                    <p className='flex items-center gap-1 mb-2 text-[13px]'>
                                        Interest <Check className="w-3 h-3 text-white" />
                                    </p>
                                    <AdvancedInputWithLabel
                                        value={displayInterest}
                                        onChange={(value) => setInterest(value || '0')}
                                        placeholder=""
                                        rightLabel="%"
                                    />
                                </div>
                                {totalInterestBTC !== null && totalInterestUSD !== null && (
                                    <p className='text-[grey] text-[12px]'>
                                        ₿{totalInterestBTC.toFixed(5)} | ${totalInterestUSD.toFixed(2)}
                                    </p>
                                )}
                            </div>

                            {apr !== null && apy !== null && (
                                <div className="flex flex-col bg-[#FF5700] w-[5em] h-[2.2em] items-center rounded-[10px]">
                                    <p className="text-white text-[10px] font-medium">
                                        {apy > 999 ? "999+" : Math.round(apy)}% APY
                                    </p>
                                    <div className="w-[80%] h-[1px] bg-white"></div>
                                    <p className="text-white text-[10px] font-medium">
                                        {apr > 999 ? "999+" : Math.round(apr)}% APR
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info section */}
                <div className="flex items-center gap-2 px-4 py-2 border border-[#2B2B2B] rounded-[10px] mt-4">
                    <Info className="w-4 h-4 text-white" /> 
                    <span className="text-white text-[10px]">If the borrower fails to repay, the loan defaults.</span>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-[#2B2B2B] text-white bg-[#0A0A0A] h-[2.5em] text-[12px] font-bold w-full sm:w-auto"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className="bg-[#FF5700] hover:bg-[#FF5700]/90 text-[12px] font-bold text-white h-[2.5em] w-full sm:w-[10em]"
                        
                    >
                        Create request
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  )
};

export default CreateOfferModal;