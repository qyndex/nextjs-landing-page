/** Supabase database types — keep in sync with migrations. */

export interface Database {
  public: {
    Tables: {
      waitlist: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          referral_source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          referral_source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          referral_source?: string | null;
          created_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_role: string | null;
          author_company: string | null;
          author_avatar_url: string | null;
          content: string;
          rating: number;
          featured: boolean;
          sort_order: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_role?: string | null;
          author_company?: string | null;
          author_avatar_url?: string | null;
          content: string;
          rating: number;
          featured?: boolean;
          sort_order?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          author_role?: string | null;
          author_company?: string | null;
          author_avatar_url?: string | null;
          content?: string;
          rating?: number;
          featured?: boolean;
          sort_order?: number | null;
          created_at?: string;
        };
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string | null;
          sort_order: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category?: string | null;
          sort_order?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          category?: string | null;
          sort_order?: number | null;
          created_at?: string;
        };
      };
    };
  };
}

/** Convenience aliases */
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type FAQ = Database["public"]["Tables"]["faqs"]["Row"];
export type WaitlistEntry = Database["public"]["Tables"]["waitlist"]["Insert"];
