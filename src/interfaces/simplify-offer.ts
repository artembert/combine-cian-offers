export interface AbstractOffer {
  id: number;
  floors_count: number;
  floor: number;
  total_area: string;
  rooms_count: number;
  latitude: number;
  longitude: number;
  metro: string;
  metro_time: number;
  metro_type: "на машине" | "пешком" | "";
  description: string;
  address: string;

  download_date: number;
}

export interface SimplifyOffer extends AbstractOffer {
  price: number;
  date: string;
}

export interface SimplifyOfferWithHistory extends AbstractOffer {
  history?: OfferHistory[];
  price_per_m?: number;
}

export interface OfferHistory {
  updatedDate: string;
  price: number;
}
