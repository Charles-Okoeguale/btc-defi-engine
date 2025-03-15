import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ScanLine, Info } from 'lucide-react';
import { CreateOfferModalProps } from '@/types';
import Image from 'next/image';
import { AdvancedInputWithLabel } from '../InputWithLabel';
import PriceTag from '@/components/modules/PriceTag';

export const CreateOfferModal: FC<CreateOfferModalProps> = ({
  isOpen,
  onOpenChange,
  ordinalData,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0A0A0A] h-[70%] text-white border border-[#2B2B2B]">
        <div className='border border-[#4B4B4B] rounded-[20px] p-4'>
            <DialogHeader>
                <DialogTitle className="font-bold text-[16px] mb-2">Create a custom request</DialogTitle>
                <div className={'h-[5em] flex flex-row items-center gap-2'}>
                    <div className='w-[20%] flex items-center justify-center'>
                        <div className="relative w-[100px] h-[70px]">
                            <div className="absolute inset-0 rounded-[10px] overflow-hidden">
                                <Image
                                    src={'/liquid.jpg'}
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
                            <span className="text-white font-sm text-[12px]">{'NPC Ordinals'}</span>
                        </div>
                        <div className="flex items-center gap-4 justify-between">
                            <span className="text-[#7D7D7D] text-[12px]">Name:</span>
                            <span className="text-white font-sm text-[12px]">{'Ordinal NPCs'}</span>
                        </div>
                        <div className="flex items-center gap-4 justify-between">
                            <span className="text-[#7D7D7D] text-[12px]">Ordinal id:</span>
                            <span className="text-white font-sm text-[12px]">{'1234eesd3#'}</span>
                        </div>
                        <div className="flex items-center gap-4 justify-between">
                            <span className="text-[#7D7D7D] text-[12px]">insc number:</span>
                            <span className="text-white font-sm text-[12px]">{'123454'}</span>
                        </div>
                    </div>
                </div>
            </DialogHeader>

            
            <div 
                className="flex items-center mt-4 justify-center gap-2 px-4 py-2 border border-[#2B2B2B] rounded-[10px] cursor-pointer hover:bg-[#2B2B2B]/10 transition-colors"
                onClick={() => console.log('')}
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
                    <p className='flex flex-row text-[13px]'>Term <Check className="w-3 h-3 text-[white] " /> </p>
                    <AdvancedInputWithLabel
                        value={'7'}
                        onChange={() => console.log('')}
                        placeholder="Enter amount..."
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
                                value={'2'}
                                onChange={() => console.log('')}
                                placeholder="Enter amount..."
                                rightLabel="₿"
                            />
                        </div>
                        <p className='text-[grey] text-[12px] mt-8'>$194723.76</p>
                    </div>

                    <PriceTag label="Best" value={0.00391} className='mt-8'/>
                </div>

                <div className='flex flex-row items-center w-full justify-between mt-4'>
                    <div className='flex flex-row items-center gap-4'>
                        <div>
                            <p className='flex flex-row items-center gap-1 mb-2 text-[13px]'>
                                Interest <Check className="w-3 h-3 text-[white]" />
                            </p>
                            <AdvancedInputWithLabel
                                value={'2'}
                                onChange={() => console.log('')}
                                placeholder="Enter amount..."
                                rightLabel="%"
                            />
                        </div>
                        <p className='text-[grey] text-[12px] mt-8'>$194.76 | $3115.58</p>
                    </div>

                    <div className="flex flex-col bg-[#FF5700] w-[5em] h-[2.2em] items-center rounded-[10px] mt-4">
                        <p className="text-[white] text-[10px] font-medium">181% APY</p>
                        <div className="w-[80%] h-[1px] bg-[white]"></div>
                        <p className="text-[white] text-[10px] font-medium">104% APR</p>
                    </div>
                </div> 
            </div>

            <div 
                className="flex items-center mt-4 gap-2 px-4 py-2 border border-[#2B2B2B] rounded-[10px] cursor-pointer hover:bg-[#2B2B2B]/10 transition-colors"
                onClick={() => console.log('')}
            >
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
                    onClick={() => onSubmit({ amount: "0.0000" })}
                    className="bg-[#FF5700] hover:bg-[#FF5700]/90 text-[12px] font-medium text-white h-[2.5em] w-[10em]"
                >
                    Create request
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};