import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/vc_compliance?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("password", 12);

  // Create VC Firm
  const vcFirm = await prisma.vCFirm.upsert({
    where: { id: "seed-vc-firm" },
    update: {},
    create: {
      id: "seed-vc-firm",
      name: "Pacific Ventures Capital",
      headquartersLocation: "San Francisco, CA",
    },
  });

  // Create admin user (password: "password")
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      passwordHash: hashedPassword,
      role: "ADMIN",
      vcFirmId: vcFirm.id,
    },
  });

  // Create Portfolio Companies
  const companies = [
    {
      id: "seed-company-1",
      name: "GreenTech Solutions",
      principalPlaceOfBusiness: "San Francisco, CA",
      vcFirmId: vcFirm.id,
    },
    {
      id: "seed-company-2",
      name: "MediCore Health",
      principalPlaceOfBusiness: "Los Angeles, CA",
      vcFirmId: vcFirm.id,
    },
    {
      id: "seed-company-3",
      name: "DataStream Analytics",
      principalPlaceOfBusiness: "San Jose, CA",
      vcFirmId: vcFirm.id,
    },
    {
      id: "seed-company-4",
      name: "UrbanMobility Inc",
      principalPlaceOfBusiness: "Oakland, CA",
      vcFirmId: vcFirm.id,
    },
    {
      id: "seed-company-5",
      name: "CloudSecure AI",
      principalPlaceOfBusiness: "Palo Alto, CA",
      vcFirmId: vcFirm.id,
    },
  ];

  for (const company of companies) {
    await prisma.portfolioCompany.upsert({
      where: { id: company.id },
      update: {},
      create: company,
    });
  }

  // Create Founding Team Members
  const founders = [
    { id: "seed-founder-1", name: "Sarah Chen", email: "sarah@greentech.example.com", title: "CEO", portfolioCompanyId: "seed-company-1", isPassiveInvestor: false },
    { id: "seed-founder-2", name: "Marcus Johnson", email: "marcus@greentech.example.com", title: "CTO", portfolioCompanyId: "seed-company-1", isPassiveInvestor: false },
    { id: "seed-founder-3", name: "Dr. Maria Garcia", email: "maria@medicore.example.com", title: "CEO", portfolioCompanyId: "seed-company-2", isPassiveInvestor: false },
    { id: "seed-founder-4", name: "James Williams", email: "james@medicore.example.com", title: "President", portfolioCompanyId: "seed-company-2", isPassiveInvestor: false },
    { id: "seed-founder-5", name: "Priya Patel", email: "priya@datastream.example.com", title: "CEO", portfolioCompanyId: "seed-company-3", isPassiveInvestor: false },
    { id: "seed-founder-6", name: "David Kim", email: "david@datastream.example.com", title: "Founder", portfolioCompanyId: "seed-company-3", isPassiveInvestor: false },
    { id: "seed-founder-7", name: "Robert Smith", email: "robert@datastream.example.com", title: "Investor", portfolioCompanyId: "seed-company-3", isPassiveInvestor: true },
    { id: "seed-founder-8", name: "Aaliyah Brown", email: "aaliyah@urbanmobility.example.com", title: "CEO", portfolioCompanyId: "seed-company-4", isPassiveInvestor: false },
    { id: "seed-founder-9", name: "Wei Zhang", email: "wei@cloudsecure.example.com", title: "CEO", portfolioCompanyId: "seed-company-5", isPassiveInvestor: false },
    { id: "seed-founder-10", name: "Emma Davis", email: "emma@cloudsecure.example.com", title: "CTO", portfolioCompanyId: "seed-company-5", isPassiveInvestor: false },
  ];

  for (const founder of founders) {
    await prisma.foundingTeamMember.upsert({
      where: { id: founder.id },
      update: {},
      create: founder,
    });
  }

  // Create Investments (calendar year 2025)
  const investments = [
    { id: "seed-inv-1", vcFirmId: vcFirm.id, portfolioCompanyId: "seed-company-1", amount: 2500000, investmentDate: new Date("2025-03-15"), calendarYear: 2025 },
    { id: "seed-inv-2", vcFirmId: vcFirm.id, portfolioCompanyId: "seed-company-2", amount: 5000000, investmentDate: new Date("2025-06-01"), calendarYear: 2025 },
    { id: "seed-inv-3", vcFirmId: vcFirm.id, portfolioCompanyId: "seed-company-3", amount: 1500000, investmentDate: new Date("2025-09-20"), calendarYear: 2025 },
    { id: "seed-inv-4", vcFirmId: vcFirm.id, portfolioCompanyId: "seed-company-4", amount: 3000000, investmentDate: new Date("2025-04-10"), calendarYear: 2025 },
    { id: "seed-inv-5", vcFirmId: vcFirm.id, portfolioCompanyId: "seed-company-5", amount: 4000000, investmentDate: new Date("2025-11-05"), calendarYear: 2025 },
  ];

  for (const investment of investments) {
    await prisma.investment.upsert({
      where: { id: investment.id },
      update: {},
      create: investment,
    });
  }

  // Create some sample survey invitations and responses
  const surveyInvitations = [
    {
      id: "seed-survey-1",
      foundingTeamMemberId: "seed-founder-1",
      investmentId: "seed-inv-1",
      calendarYear: 2025,
      token: "seed-token-1",
      status: "COMPLETED" as const,
      sentAt: new Date("2025-04-01"),
      completedAt: new Date("2025-04-05"),
    },
    {
      id: "seed-survey-2",
      foundingTeamMemberId: "seed-founder-2",
      investmentId: "seed-inv-1",
      calendarYear: 2025,
      token: "seed-token-2",
      status: "COMPLETED" as const,
      sentAt: new Date("2025-04-01"),
      completedAt: new Date("2025-04-03"),
    },
    {
      id: "seed-survey-3",
      foundingTeamMemberId: "seed-founder-3",
      investmentId: "seed-inv-2",
      calendarYear: 2025,
      token: "seed-token-3",
      status: "COMPLETED" as const,
      sentAt: new Date("2025-07-01"),
      completedAt: new Date("2025-07-10"),
    },
    {
      id: "seed-survey-4",
      foundingTeamMemberId: "seed-founder-4",
      investmentId: "seed-inv-2",
      calendarYear: 2025,
      token: "seed-token-4",
      status: "SENT" as const,
      sentAt: new Date("2025-07-01"),
      completedAt: null,
    },
    {
      id: "seed-survey-5",
      foundingTeamMemberId: "seed-founder-5",
      investmentId: "seed-inv-3",
      calendarYear: 2025,
      token: "seed-token-5",
      status: "COMPLETED" as const,
      sentAt: new Date("2025-10-01"),
      completedAt: new Date("2025-10-15"),
    },
  ];

  for (const invitation of surveyInvitations) {
    await prisma.surveyInvitation.upsert({
      where: { id: invitation.id },
      update: {},
      create: invitation,
    });
  }

  // Create sample survey responses
  const surveyResponses = [
    {
      id: "seed-response-1",
      surveyInvitationId: "seed-survey-1",
      calendarYear: 2025,
      genderWoman: true,
      raceAsian: true,
      lgbtqNo: true,
      disabilityNo: true,
      veteranNo: true,
      caResidentYes: true,
    },
    {
      id: "seed-response-2",
      surveyInvitationId: "seed-survey-2",
      calendarYear: 2025,
      genderMan: true,
      raceBlack: true,
      lgbtqNo: true,
      disabilityNo: true,
      veteranYes: true,
      caResidentYes: true,
    },
    {
      id: "seed-response-3",
      surveyInvitationId: "seed-survey-3",
      calendarYear: 2025,
      genderWoman: true,
      raceHispanic: true,
      lgbtqNo: true,
      disabilityNo: true,
      veteranNo: true,
      caResidentYes: true,
    },
    {
      id: "seed-response-5",
      surveyInvitationId: "seed-survey-5",
      calendarYear: 2025,
      genderWoman: true,
      raceAsian: true,
      lgbtqYes: true,
      disabilityNo: true,
      veteranNo: true,
      caResidentNo: true,
    },
  ];

  for (const response of surveyResponses) {
    await prisma.surveyResponse.upsert({
      where: { id: response.id },
      update: {},
      create: response,
    });
  }

  console.log("Database seeded successfully!");
  console.log(`  - VC Firm: ${vcFirm.name}`);
  console.log(`  - Admin User: ${adminUser.email} (password: "password")`);
  console.log(`  - Portfolio Companies: ${companies.length}`);
  console.log(`  - Founding Team Members: ${founders.length}`);
  console.log(`  - Investments: ${investments.length}`);
  console.log(`  - Survey Invitations: ${surveyInvitations.length}`);
  console.log(`  - Survey Responses: ${surveyResponses.length}`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
