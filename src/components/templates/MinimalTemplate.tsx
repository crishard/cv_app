import { CVData } from "@/types/cv";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 mt-6 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
      {children}
    </h2>
  );
}

export function MinimalTemplate({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, certifications } = data;

  return (
    <div className="mx-auto max-w-[794px] bg-white px-12 py-10 font-sans text-[15px] text-gray-800 wrap-break-word">
      <header className="mb-6">
        <h1 className="text-2xl font-light tracking-tight text-gray-900">
          {personalInfo.fullName}
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          {[personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
        {(personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && (
          <p className="text-sm text-gray-400">
            {[personalInfo.linkedin, personalInfo.github, personalInfo.portfolio]
              .filter(Boolean)
              .join("  ·  ")}
          </p>
        )}
      </header>

      {personalInfo.summary && (
        <section>
          <SectionTitle>Summary</SectionTitle>
          <p className="text-sm leading-relaxed text-gray-600">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section>
          <SectionTitle>Experience</SectionTitle>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex items-baseline justify-between">
                <span className="font-medium">{exp.position}</span>
                <span className="text-xs text-gray-400">
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-500">{exp.company}</p>
              {exp.description && (
                <p className="mt-1 text-sm text-gray-600">{exp.description}</p>
              )}
              {exp.achievements.length > 0 && (
                <ul className="mt-1 space-y-0.5 text-sm text-gray-600">
                  {exp.achievements.map((a, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section>
          <SectionTitle>Education</SectionTitle>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex items-baseline justify-between">
                <span className="font-medium">{edu.institution}</span>
                <span className="text-xs text-gray-400">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {edu.degree} in {edu.field}
                {edu.gpa && ` · GPA ${edu.gpa}`}
              </p>
            </div>
          ))}
        </section>
      )}

      {(skills.technical.length > 0 || skills.soft.length > 0) && (
        <section>
          <SectionTitle>Skills</SectionTitle>
          {skills.technical.length > 0 && (
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Technical  </span>
              {skills.technical.join(", ")}
            </p>
          )}
          {skills.soft.length > 0 && (
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-medium text-gray-800">Soft  </span>
              {skills.soft.join(", ")}
            </p>
          )}
          {skills.languages.length > 0 && (
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-medium text-gray-800">Languages  </span>
              {skills.languages.map((l) => `${l.name} (${l.level})`).join(", ")}
            </p>
          )}
        </section>
      )}

      {certifications.length > 0 && (
        <section>
          <SectionTitle>Certifications</SectionTitle>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-1 flex items-baseline justify-between">
              <span className="text-sm font-medium">{cert.name}</span>
              <span className="text-xs text-gray-400">
                {cert.issuer} · {cert.date}
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
