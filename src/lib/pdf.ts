import puppeteer from "puppeteer";

export async function generatePDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

export function cvDataToText(data: import("@/types/cv").CVData): string {
  const { personalInfo, experience, education, skills, certifications } = data;
  const lines: string[] = [
    personalInfo.fullName,
    [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(" | "),
    personalInfo.summary,
    "",
    "EXPERIENCE",
    ...experience.flatMap((e) => [
      `${e.position} at ${e.company}`,
      e.description,
      ...e.achievements,
    ]),
    "",
    "EDUCATION",
    ...education.map((e) => `${e.degree} in ${e.field} - ${e.institution}`),
    "",
    "SKILLS",
    skills.technical.join(", "),
    skills.soft.join(", "),
    "",
    "CERTIFICATIONS",
    ...certifications.map((c) => `${c.name} - ${c.issuer}`),
  ];
  return lines.filter((l) => l !== undefined).join("\n");
}
