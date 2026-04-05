import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

const CHROMIUM_REMOTE_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

export async function generatePDF(html: string): Promise<Buffer> {
  const isLocal = process.env.NODE_ENV === "development";

  const browser = await puppeteer.launch({
    args: isLocal ? [] : chromium.args,
    executablePath: isLocal
      ? undefined
      : await chromium.executablePath(CHROMIUM_REMOTE_URL),
    headless: true,
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
