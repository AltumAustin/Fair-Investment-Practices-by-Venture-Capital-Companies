import { z } from "zod";

export const portfolioCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  principalPlaceOfBusiness: z.string().optional(),
});

export const foundingTeamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  title: z.string().optional(),
  portfolioCompanyId: z.string().min(1, "Portfolio company is required"),
  isPassiveInvestor: z.boolean().default(false),
});

export const investmentSchema = z.object({
  portfolioCompanyId: z.string().min(1, "Portfolio company is required"),
  amount: z.string().min(1, "Investment amount is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Amount must be a positive number"
  ),
  investmentDate: z.string().min(1, "Investment date is required"),
});

export const surveyResponseSchema = z.object({
  token: z.string().min(1),
  genderWoman: z.boolean().default(false),
  genderMan: z.boolean().default(false),
  genderNonbinary: z.boolean().default(false),
  genderTransgender: z.boolean().default(false),
  genderNoneOfAbove: z.boolean().default(false),
  genderDecline: z.boolean().default(false),
  raceBlack: z.boolean().default(false),
  raceAsian: z.boolean().default(false),
  raceHispanic: z.boolean().default(false),
  raceNativeAmerican: z.boolean().default(false),
  raceNativeHawaiian: z.boolean().default(false),
  raceWhite: z.boolean().default(false),
  raceNoneOfAbove: z.boolean().default(false),
  raceDecline: z.boolean().default(false),
  lgbtqYes: z.boolean().default(false),
  lgbtqNo: z.boolean().default(false),
  lgbtqDecline: z.boolean().default(false),
  disabilityYes: z.boolean().default(false),
  disabilityNo: z.boolean().default(false),
  disabilityDecline: z.boolean().default(false),
  veteranYes: z.boolean().default(false),
  veteranDisabled: z.boolean().default(false),
  veteranNo: z.boolean().default(false),
  veteranDecline: z.boolean().default(false),
  caResidentYes: z.boolean().default(false),
  caResidentNo: z.boolean().default(false),
  caResidentDecline: z.boolean().default(false),
  declineAll: z.boolean().default(false),
});

export type PortfolioCompanyInput = z.infer<typeof portfolioCompanySchema>;
export type FoundingTeamMemberInput = z.infer<typeof foundingTeamMemberSchema>;
export type InvestmentInput = z.infer<typeof investmentSchema>;
export type SurveyResponseInput = z.infer<typeof surveyResponseSchema>;
