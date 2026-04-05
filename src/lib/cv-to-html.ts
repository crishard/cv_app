import { CVData, TemplateId } from "@/types/cv";

function esc(str: string = ""): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function baseHtml(body: string, extraStyles = ""): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; background: #fff; }
    ${extraStyles}
  </style></head><body>${body}</body></html>`;
}

function modernHtml(data: CVData): string {
  const { personalInfo: p, experience, education, skills, certifications } = data;
  const contact = [p.email, p.phone, p.location].filter(Boolean).map(esc).join(" · ");
  const links = [p.linkedin, p.github, p.portfolio].filter(Boolean).map(esc).join(" · ");

  const expHtml = experience.map((e) => `
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between">
        <strong>${esc(e.position)}</strong>
        <span style="font-size:11px;color:#888">${esc(e.startDate)} – ${e.current ? "Present" : esc(e.endDate)}</span>
      </div>
      <div style="font-size:12px;color:#666">${esc(e.company)}</div>
      ${e.description ? `<p style="font-size:12px;margin-top:4px">${esc(e.description)}</p>` : ""}
      ${e.achievements.length ? `<ul style="font-size:12px;padding-left:18px;margin-top:4px">${e.achievements.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}
    </div>`).join("");

  const eduHtml = education.map((e) => `
    <div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between">
        <strong>${esc(e.institution)}</strong>
        <span style="font-size:11px;color:#888">${esc(e.startDate)} – ${esc(e.endDate)}</span>
      </div>
      <div style="font-size:12px;color:#666">${esc(e.degree)} in ${esc(e.field)}${e.gpa ? ` · GPA ${esc(e.gpa)}` : ""}</div>
    </div>`).join("");

  const skillsHtml = [
    skills.technical.length ? `<p style="font-size:12px"><strong>Technical:</strong> ${skills.technical.map(esc).join(", ")}</p>` : "",
    skills.soft.length ? `<p style="font-size:12px"><strong>Soft:</strong> ${skills.soft.map(esc).join(", ")}</p>` : "",
    skills.languages.length ? `<p style="font-size:12px"><strong>Languages:</strong> ${skills.languages.map((l) => `${esc(l.name)} (${esc(l.level)})`).join(", ")}</p>` : "",
  ].filter(Boolean).join("");

  const certHtml = certifications.map((c) => `
    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
      <strong>${esc(c.name)}</strong>
      <span style="color:#888">${esc(c.issuer)} · ${esc(c.date)}</span>
    </div>`).join("");

  function section(title: string, content: string) {
    return `<section style="margin-bottom:20px">
      <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#2563eb;border-bottom:2px solid #2563eb;padding-bottom:4px;margin-bottom:8px">${title}</h2>
      ${content}
    </section>`;
  }

  const body = `<div style="max-width:794px;margin:0 auto;padding:40px">
    <h1 style="font-size:26px;font-weight:700;margin-bottom:4px">${esc(p.fullName)}</h1>
    <p style="font-size:12px;color:#666">${contact}</p>
    ${links ? `<p style="font-size:12px;color:#666">${links}</p>` : ""}
    ${p.summary ? section("Summary", `<p style="font-size:12px;line-height:1.6">${esc(p.summary)}</p>`) : ""}
    ${experience.length ? section("Experience", expHtml) : ""}
    ${education.length ? section("Education", eduHtml) : ""}
    ${skillsHtml ? section("Skills", skillsHtml) : ""}
    ${certifications.length ? section("Certifications", certHtml) : ""}
  </div>`;

  return baseHtml(body);
}

function classicHtml(data: CVData): string {
  const { personalInfo: p, experience, education, skills, certifications } = data;
  const contact = [p.email, p.phone, p.location].filter(Boolean).map(esc).join(" | ");

  const expHtml = experience.map((e) => `
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between">
        <strong>${esc(e.company)}</strong>
        <span style="font-size:12px">${esc(e.startDate)} – ${e.current ? "Present" : esc(e.endDate)}</span>
      </div>
      <em style="font-size:12px">${esc(e.position)}</em>
      ${e.description ? `<p style="font-size:12px;margin-top:4px">${esc(e.description)}</p>` : ""}
      ${e.achievements.length ? `<ul style="font-size:12px;padding-left:18px;margin-top:4px">${e.achievements.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}
    </div>`).join("");

  const eduHtml = education.map((e) => `
    <div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between">
        <strong>${esc(e.institution)}</strong>
        <span style="font-size:12px">${esc(e.startDate)} – ${esc(e.endDate)}</span>
      </div>
      <em style="font-size:12px">${esc(e.degree)} in ${esc(e.field)}${e.gpa ? ` · GPA ${esc(e.gpa)}` : ""}</em>
    </div>`).join("");

  const skillsHtml = [
    skills.technical.length ? `<p style="font-size:12px"><strong>Technical:</strong> ${skills.technical.map(esc).join(", ")}</p>` : "",
    skills.soft.length ? `<p style="font-size:12px"><strong>Soft Skills:</strong> ${skills.soft.map(esc).join(", ")}</p>` : "",
    skills.languages.length ? `<p style="font-size:12px"><strong>Languages:</strong> ${skills.languages.map((l) => `${esc(l.name)} (${esc(l.level)})`).join(", ")}</p>` : "",
  ].filter(Boolean).join("");

  function section(title: string, content: string) {
    return `<section style="margin-bottom:20px">
      <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#1a1a1a;border-bottom:1px solid #1a1a1a;padding-bottom:3px;margin-bottom:8px">${title}</h2>
      ${content}
    </section>`;
  }

  const body = `<div style="max-width:794px;margin:0 auto;padding:40px;font-family:'Times New Roman',Times,serif">
    <div style="text-align:center;margin-bottom:20px">
      <h1 style="font-size:24px;font-weight:700;text-transform:uppercase;letter-spacing:3px">${esc(p.fullName)}</h1>
      <p style="font-size:12px;margin-top:4px">${contact}</p>
    </div>
    ${p.summary ? section("Professional Summary", `<p style="font-size:12px;line-height:1.6">${esc(p.summary)}</p>`) : ""}
    ${experience.length ? section("Professional Experience", expHtml) : ""}
    ${education.length ? section("Education", eduHtml) : ""}
    ${skillsHtml ? section("Skills", skillsHtml) : ""}
    ${certifications.length ? section("Certifications", certifications.map((c) => `<div style="display:flex;justify-content:space-between;font-size:12px"><strong>${esc(c.name)}</strong><span>${esc(c.issuer)} · ${esc(c.date)}</span></div>`).join("")) : ""}
  </div>`;

  return baseHtml(body);
}

function minimalHtml(data: CVData): string {
  const { personalInfo: p, experience, education, skills, certifications } = data;
  const contact = [p.email, p.phone, p.location].filter(Boolean).map(esc).join("  ·  ");

  const expHtml = experience.map((e) => `
    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between">
        <span style="font-weight:500">${esc(e.position)}</span>
        <span style="font-size:11px;color:#aaa">${esc(e.startDate)} – ${e.current ? "Present" : esc(e.endDate)}</span>
      </div>
      <div style="font-size:12px;color:#888">${esc(e.company)}</div>
      ${e.description ? `<p style="font-size:12px;color:#555;margin-top:4px">${esc(e.description)}</p>` : ""}
      ${e.achievements.length ? `<ul style="font-size:12px;list-style:none;padding:0;margin-top:4px">${e.achievements.map((a) => `<li style="padding-left:12px;position:relative"><span style="position:absolute;left:0;color:#aaa">·</span>${esc(a)}</li>`).join("")}</ul>` : ""}
    </div>`).join("");

  const skillsHtml = [
    skills.technical.length ? `<p style="font-size:12px;color:#555"><span style="font-weight:500;color:#1a1a1a">Technical  </span>${skills.technical.map(esc).join(", ")}</p>` : "",
    skills.soft.length ? `<p style="font-size:12px;color:#555;margin-top:4px"><span style="font-weight:500;color:#1a1a1a">Soft  </span>${skills.soft.map(esc).join(", ")}</p>` : "",
    skills.languages.length ? `<p style="font-size:12px;color:#555;margin-top:4px"><span style="font-weight:500;color:#1a1a1a">Languages  </span>${skills.languages.map((l) => `${esc(l.name)} (${esc(l.level)})`).join(", ")}</p>` : "",
  ].filter(Boolean).join("");

  function section(title: string, content: string) {
    return `<section style="margin-top:24px">
      <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#aaa;margin-bottom:10px">${title}</h2>
      ${content}
    </section>`;
  }

  const body = `<div style="max-width:794px;margin:0 auto;padding:40px 48px">
    <h1 style="font-size:22px;font-weight:300;letter-spacing:-0.5px">${esc(p.fullName)}</h1>
    <p style="font-size:12px;color:#aaa;margin-top:4px">${contact}</p>
    ${p.summary ? section("Summary", `<p style="font-size:12px;color:#555;line-height:1.6">${esc(p.summary)}</p>`) : ""}
    ${experience.length ? section("Experience", expHtml) : ""}
    ${education.length ? section("Education", education.map((e) => `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between"><span style="font-weight:500">${esc(e.institution)}</span><span style="font-size:11px;color:#aaa">${esc(e.startDate)} – ${esc(e.endDate)}</span></div><div style="font-size:12px;color:#888">${esc(e.degree)} in ${esc(e.field)}</div></div>`).join("")) : ""}
    ${skillsHtml ? section("Skills", skillsHtml) : ""}
    ${certifications.length ? section("Certifications", certifications.map((c) => `<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span style="font-weight:500">${esc(c.name)}</span><span style="color:#aaa">${esc(c.issuer)} · ${esc(c.date)}</span></div>`).join("")) : ""}
  </div>`;

  return baseHtml(body);
}

const GENERATORS: Record<TemplateId, (data: CVData) => string> = {
  modern: modernHtml,
  classic: classicHtml,
  minimal: minimalHtml,
};

export function cvToHtml(data: CVData, templateId: TemplateId): string {
  return (GENERATORS[templateId] ?? modernHtml)(data);
}
