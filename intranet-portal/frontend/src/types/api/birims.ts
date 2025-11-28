export interface Birim {
  birimID: number;
  birimAdi: string;
  aciklama?: string;
  isActive: boolean;
}

export interface CreateBirimRequest {
  birimAdi: string;
  aciklama?: string;
  isActive: boolean;
}

export interface UpdateBirimRequest {
  birimAdi: string;
  aciklama?: string;
  isActive: boolean;
}
