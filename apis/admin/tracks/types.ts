export interface Track {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface TrackPayload {
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
}
