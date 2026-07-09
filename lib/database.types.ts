export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          payer: "Tisa" | "Palm";
          note: string;
          amount: number | string;
          expression: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          payer: "Tisa" | "Palm";
          note?: string;
          amount: number;
          expression: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          payer?: "Tisa" | "Palm";
          note?: string;
          amount?: number;
          expression?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
