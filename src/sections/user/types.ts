export interface UserProps {
  id: string;
  username: string;
  fullname: string;
  patronymic: string;
  photo: string;
  dob: Date;
  gender: string;
  email: string;
  phone_number: string;
  registration_date: Date;
  last_login: Date;
  status: number;
  is_verified: number;
  is_2fa: number;
  currency: number;
  language: string;
  country: string;
  city: string;
  role_id: number;
  created_at: Date;
  updated_at: Date;
  balance: number;
  bonus_balance: number;
  total_deposits: number;
  total_withdrawals: number;
  last_deposit_date: Date;
  last_withdrawal_date: Date;
  referredByName: string;
  verification_status: 'not_started' | 'pending' | 'approved' | 'rejected';
  sumsub_id: string;
  sumsub_status: 'not_started' | 'in_review' | 'approved_sumsub' | 'rejected_sumsub' | 'approved' | 'rejected' | null;
  admin_status: 'pending' | 'approved' | 'rejected' | null;
  sumsub_notes: string | null;
  admin_notes: string | null;
  sumsub_verification_date?: string | null;
  sumsub_details?: {
    documents?: string[];
    nextSteps?: string[];
  };
}