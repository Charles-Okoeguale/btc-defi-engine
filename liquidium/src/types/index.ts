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

export interface GetOffersParams {
  userId: string;
  page: number;
  limit: number;
}

export interface PaginatedResponse {
  offers: Offer[];
  pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
  }
}

export interface CreateOfferModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ordinalData: any; 
  onSubmit: (data: any) => void; 
  onClose?: () => void; 
}

export interface OrdinalsBottomSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  ordinals: Ordinal[]
  floorPrices: Record<string, number>
  onCreateOffer: (ordinal: Ordinal) => void
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
    ltv: number;
    status: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'COMPLETED';
    userId: string;
    ordinalId: string;
    ordinal: {
      id: string;
      inscriptionId: string;
      inscriptionNumber: number;
      name: string;
      contentUrl: string;
      renderUrl: string;
      lastSalePrice: number;
      collection: {
        name: string;
        floorPrice: number;
      }
    }
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