import { FC, useState } from 'react';
import Image from 'next/image';
import { Check, Info, ScanLine } from 'lucide-react';
import { calculateInterest, calculateRates } from '@/lib/financial';
import { BTC_PRICE_USD, MOCK_USER_ID } from '@/constants';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AdvancedInputWithLabel } from '../InputWithLabel';
import PriceTag from '@/components/modules/PriceTag';
import { Button } from '../button';
import { CreateOfferModalProps } from '@/types';


export const EditCustomRequest: FC<CreateOfferModalProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  ordinalData,
}) => {

    if (!ordinalData || !ordinalData.ordinal) {
        return null;
    }

    const [amount, setAmount] = useState<string>(ordinalData?.amount?.toString() || '0');
    const [term, setTerm] = useState<string>(ordinalData?.term?.toString() || '0');
    const [interest, setInterest] = useState<string>(ordinalData?.interest?.toString() || '0');
    const [userBalance, setUserBalance] = useState<number>(0.00391);
    const [btcPrice, setBtcPrice] = useState<number>(BTC_PRICE_USD);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const amountValue = amount ? parseFloat(amount) : null;
    const termValue = term ? parseInt(term) : null;
    const interestValue = interest ? parseFloat(interest) : null;
    const amountUSD = amountValue !== null ? amountValue * btcPrice : null;

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
            await onSubmit({
              amount: amountValue!,
              term: termValue!,
              interest: interestValue!,
              ordinalId: ordinalData.ordinal.inscriptionId,
              userId: MOCK_USER_ID 
            });
            onOpenChange(false);
          } catch (err) {
            setError("Failed to update request. Please try again.");
            console.error("Update error:", err);
          } finally {
            setIsSubmitting(false);
          }
        }
    };

    

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="bg-[#0A0A0A] h-[70%] text-white border border-[#2B2B2B]">
            <div className='border border-[#4B4B4B] rounded-[20px] p-4'>
                <DialogHeader>
                    <DialogTitle className="font-bold text-[16px] mb-2">Edit custom request</DialogTitle>
                    <div className={'h-[5em] flex flex-row items-center gap-2'}>
                        <div className='w-[20%] flex items-center justify-center'>
                            <div className="relative w-[100px] h-[70px]">
                                <div className="absolute inset-0 rounded-[10px] overflow-hidden">
                                    <Image
                                        src={ordinalData?.ordinal?.renderUrl}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='w-[80%] flex flex-col px-2'>
                            <div className="flex items-center gap-4 justify-between">
                                <span className="text-[#7D7D7D] text-[12px]">Collection:</span>
                                <span className="text-white font-sm text-[12px]">{ordinalData.ordinal.collection.name}</span>
                            </div>
                            <div className="flex items-center gap-4 justify-between">
                                <span className="text-[#7D7D7D] text-[12px]">Name:</span>
                                <span className="text-white font-sm text-[12px]">{ordinalData.ordinal.name}</span>
                            </div>
                            <div className="flex items-center gap-4 justify-between">
                                <span className="text-[#7D7D7D] text-[12px]">Ordinal id:</span>
                                <span className="text-white font-sm text-[12px]">
                                    {ordinalData.ordinal.inscriptionId.substring(0, 4)}...
                                    {ordinalData.ordinal.inscriptionId.substring(ordinalData.ordinal.inscriptionId.length - 8)}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 justify-between">
                                <span className="text-[#7D7D7D] text-[12px]">insc number:</span>
                                <span className="text-white font-sm text-[12px]">{ordinalData.ordinal.inscriptionNumber}</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div 
                    className="flex items-center mt-4 justify-center gap-2 px-4 py-2 border border-[#2B2B2B] rounded-[10px] cursor-pointer hover:bg-[#2B2B2B]/10 transition-colors"
                    onClick={() => window.open(`https://ordinals.com/inscription/${ordinalData.ordinal.inscriptionId}`, '_blank')}
                >
                    <ScanLine className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">View</span>
                </div>

                <div className='mt-8'>
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[white] bg-[#FF5700] rounded-[10px]" /> 
                        <h5 className="text-white text-[14px]">Set loan terms</h5>
                    </div>
                    
                    <div className='mt-4'>
                        <p className='flex flex-row text-[13px]'>Term <Check className="w-3 h-3 text-[white]" /> </p>
                        <AdvancedInputWithLabel
                            value={displayTerm}
                            onChange={(value) => setTerm(value || '0')}
                            placeholder=""
                            rightLabel="Days"
                        />
                    </div>

                    <div className='flex flex-row items-center w-full justify-between mt-4'>
                        <div className='flex flex-row items-center gap-4'>
                            <div>
                                <p className='flex flex-row items-center gap-1 mb-2 text-[13px]'>
                                    Amount <Check className="w-3 h-3 text-[white]" />
                                </p>
                                <AdvancedInputWithLabel
                                    value={displayAmount}
                                    onChange={(value) => setAmount(value || '0')}
                                    placeholder=""
                                    rightLabel="₿"
                                />
                            </div>
                            {amountUSD !== null && (
                                <p className='text-[grey] text-[12px] mt-8'>${amountUSD.toFixed(2)}</p>
                            )}
                        </div>

                        <PriceTag 
                            label="Bal" 
                            value={`₿ ${userBalance.toFixed(5)}`} 
                            className='mt-8'
                        />
                    </div>

                    <div className='flex flex-row items-center w-full justify-between mt-4'>
                        <div className='flex flex-row items-center gap-4'>
                            <div>
                                <p className='flex flex-row items-center gap-1 mb-2 text-[13px]'>
                                    Interest <Check className="w-3 h-3 text-[white]" />
                                </p>
                                <AdvancedInputWithLabel
                                    value={displayInterest}
                                    onChange={(value) => setInterest(value || '0')}
                                    placeholder=""
                                    rightLabel="%"
                                />
                            </div>
                            {totalInterestBTC !== null && totalInterestUSD !== null && (
                                <p className='text-[grey] text-[12px] mt-8'>
                                    ₿{totalInterestBTC.toFixed(5)} | ${totalInterestUSD.toFixed(2)}
                                </p>
                            )}
                        </div>

                        {apr !== null && apy !== null && (
                            <div className="flex flex-col bg-[#FF5700] w-[5em] h-[2.2em] items-center rounded-[10px] mt-4">
                                <p className="text-[white] text-[10px] font-medium">
                                    {apy > 999 ? "999+" : Math.round(apy)}% APY
                                </p>
                                <div className="w-[80%] h-[1px] bg-[white]"></div>
                                <p className="text-[white] text-[10px] font-medium">
                                    {apr > 999 ? "999+" : Math.round(apr)}% APR
                                </p>
                            </div>
                        )}
                    </div> 
                </div>

                <div className="flex items-center mt-4 gap-2 px-4 py-2 border border-[#2B2B2B] rounded-[10px] cursor-pointer hover:bg-[#2B2B2B]/10 transition-colors">
                    <Info className="w-4 h-4 text-white" /> 
                    <span className="text-white text-[10px]">If the borrower fails to repay, the loan defaults.</span>
                </div>

                <div className="flex justify-between gap-3 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-[#2B2B2B] text-white bg-[#0A0A0A] h-[2.5em] text-[12px]"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid || isSubmitting}
                        className="bg-[#FF5700] hover:bg-[#FF5700]/90 text-[12px] font-medium text-white h-[2.5em] w-[10em]"
                    >
                        {isSubmitting ? "Updating..." : "Update request"}
                    </Button>
                </div>

                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
            </div>
          </DialogContent>
        </Dialog>
    );
};