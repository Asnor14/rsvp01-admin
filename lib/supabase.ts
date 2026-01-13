import { createClient } from "@supabase/supabase-js";

// TypeScript interfaces for database tables
export interface Invitation {
  id: string;
  created_at: string;
  family_name: string;
  max_guests: number;
  status: string;
}

export interface Guest {
  id: number;
  created_at: string;
  invitation_id: string;
  name: string;
  attending: boolean;
  guest_count: number;
  message: string | null;
  email: string | null;
  additional_guests?: (string | { name: string })[] | null;
}

export interface InvitationWithGuests extends Invitation {
  guests: Guest[];
  stats: {
    total_responses: number;
    attending_count: number;
    declined_count: number;
    total_guest_count: number;
  };
}

export interface DashboardStats {
  total_invitations: number;
  total_attending: number;
  total_declined: number;
  total_guest_count: number;
  response_rate: number;
}

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client singleton
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
