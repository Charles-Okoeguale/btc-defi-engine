import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AdvancedInputWithLabelProps } from '@/types';

export const AdvancedInputWithLabel: FC<AdvancedInputWithLabelProps> = ({
  value,
  onChange,
  placeholder,
  rightLabel,
  onLabelClick,
  disabled = false,
  error,
  className,
  inputClassName,
  labelClassName
}) => {
  return (
    <div className={cn("relative w-[120px]", className)}> 
        <Input
          value={value}
          onChange={(e) => {
            const inputValue = e.target.value;
            const numericRegex = /^[0-9]*\.?[0-9]*$/;
            
            if (inputValue === '' || numericRegex.test(inputValue)) {
              onChange?.(inputValue);
            }
          }}
          placeholder={placeholder}
          type="number"
          disabled={disabled}
          step="any" 
          min="0" 
          className={cn(
            "pr-[45px]", 
            "bg-[#141414] text-white border-[#2B2B2B]",
            error && "border-red-500",
            disabled && "opacity-50",
            inputClassName
          )}
        />
        <div
            onClick={onLabelClick}
            className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2",
            "px-1.5 py-0.5 rounded-md bg-[#2B2B2B] text-white text-xs", 
            "transition-colors",
            "min-w-[35px] text-center", 
            onLabelClick && "cursor-pointer hover:bg-[#3B3B3B]",
            disabled && "opacity-50 cursor-not-allowed",
            labelClassName
            )}
        >
            {rightLabel}
        </div>
        {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
    </div>
  );
};
