export interface PortfolioValueCardProps {
    title: string;
    btcValue: number;
    usdValue: number;
    className?: string;
}

export interface OrdinalCardProps {
    collectionName: string;
    name: string;
    id: string;
    number: string;
    imageUrl: string;
    floorPrice?: number;
    currentPrice?: number;
    className?: string;
    onCreateOffer?: () => void;
}

export interface PriceTagProps {
    label: string;
    value: string;
    className?: string;
}

export interface OfferListItemProps {
    imageUrl: string;
    collectionName: string;
    name: string;
    id: string;
    number: string;
    floorPrice: string;
    currentPrice: string;
    onEdit: () => void;
    onDelete: () => void;
    className?: string;
}

export interface CreateOfferModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    ordinalData: {
      collectionName: string;
      name: string;
      id: string;
      floorPrice: string;
    };
    onSubmit: (offerData: { amount: string }) => void;
}

export interface AdvancedInputWithLabelProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    rightLabel: string;
    onLabelClick?: () => void;
    disabled?: boolean;
    error?: string;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
  }