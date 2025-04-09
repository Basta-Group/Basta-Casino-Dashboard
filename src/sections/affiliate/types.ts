export interface AffiliateProps {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  status: number;
  referralCode:string;
  country:string;
  marketingEmailsOptIn:boolean;
  hearAboutUs:string;
  createdAt:Date;
  promotionMethod: string[]; 
}