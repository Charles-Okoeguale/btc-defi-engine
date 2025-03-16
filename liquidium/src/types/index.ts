export interface PortfolioValueCardProps {
    title: string;
    btcValue: number;
    usdValue: number;
    className?: string;
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

export interface Ordinal {
  inscription_name: string;
  inscription_id: string;
  inscription_number: number;
  slug: string;
  collection_name: string;
  content_url: string;
  render_url: string | null;
  last_sale_price: number;
  owner_wallet_addr: string;
  delegate?: {
    render_url: string | null;
    content_url: string;
  };
}

export interface OrdinalCardProps {
  ordinal: Ordinal;
  floorPrice?: number; 
  className?: string;
  onCreateOffer: (ordinal: Ordinal) => void;
}

export interface CreateOfferModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ordinalData: Ordinal;
  onSubmit: (offerData: OfferData) => Promise<void>;
  onClose: () => void;
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

  export interface OfferData {
    amount: number;
    term: number;
    interest: number;
    ordinalId: string;
    userId: string;
  }