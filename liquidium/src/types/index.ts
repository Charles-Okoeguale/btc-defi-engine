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

export interface Ordinal {
    id: string;
    inscription_id: string;
    inscription_name: string;
    slug: string;
    collection_name: string;
    render_url: string;
    content_url: string;
    last_sale_price: number;
  }
  
  export interface WalletResponse {
    ordinals: Ordinal[];
    stats: {
      totalPortfolioValue: number;
      availableLiquidity: number;
    };
  }
  
  export interface Collection {
    id: string;
    name: string;
    slug: string;
    floorPrice: number;
    isSupported: boolean;
  }
  
  export interface Offer {
    id: string;
    createdAt: string;
    updatedAt: string;
    amount: number;
    term: number;
    interest: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
    ordinalId: string;
    userId: string;
    floorPrice?: number;
    ltv?: number;
    ordinalName?: string;
    collectionName?: string;
  }
  
  export interface CreateOfferData {
    amount: number;
    term: number;
    interest: number;
    ordinalId: string;
  }