export interface AffiliateProps {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  status: number;
  referralCode: string;
  country: string;
  marketingEmailsOptIn: boolean;
  hearAboutUs: string;
  createdAt: Date;
  promotionMethod: string[];
  totalSignups?: number;
  totalClicks?: number;
  pendingEarnings?: number;
  commissionRate?: number;
  paidEarnings?: number;
  totalEarnings?: number;
}

export interface ReferredUser {
  phone_number: string;
  _id: string;
  username: string;
  fullname: string;
  email: string;
  full_phone_number: string;
  country_code: string;
  referredByName: string;
  is_verified: boolean;
  status: number;
}
