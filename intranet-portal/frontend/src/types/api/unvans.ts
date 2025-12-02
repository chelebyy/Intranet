export interface Unvan {
    unvanID: number;
    unvanAdi: string;
    aciklama?: string;
    isActive: boolean;
}

export interface CreateUnvanRequest {
    unvanAdi: string;
    aciklama?: string;
    isActive?: boolean;
}

export interface UpdateUnvanRequest {
    unvanAdi: string;
    aciklama?: string;
    isActive?: boolean;
}
