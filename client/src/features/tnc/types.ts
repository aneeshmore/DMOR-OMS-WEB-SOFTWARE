export interface Tnc {
  tncId: number;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTncInput {
  type: string;
  description: string;
}

export interface UpdateTncInput {
  type?: string;
  description: string;
}
