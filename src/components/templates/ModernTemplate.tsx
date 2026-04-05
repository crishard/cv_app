import { CVData } from "@/types/cv";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 border-b-2 border-blue-600 pb-1 text-sm font-bold uppercase tracking-widest text-blue-600">
      {children}
    </h2>
  );
}

export function ModernTemplate({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, certifications } = data;

  return (
    <div className="mx-auto max-w-[794px] bg-white p-10 font-sans text-gray-800">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{personalInfo.fullName}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {[personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {(personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && (
          <p className="mt-0.5 text-sm text-gray-500">
            {[personalInfo.linkedin, personalInfo.github, personalInfo.portfolio]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </header>

      {personalInfo.summary && (
        <section className="mb-5">
          <SectionTitle>Summary</SectionTitle>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-5">
          <SectionTitle>Experience</SectionTitle>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">{exp.position}</span>
                <span className="text-xs text-gray-400">
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-500">{exp.company}</p>
              {exp.description && (
                <p className="mt-1 text-sm">{exp.description}</p>
              )}
              {exp.achievements.length > 0 && (
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {exp.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-5">
          <SectionTitle>Education</SectionTitle>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">{edu.institution}</span>
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
        <section className="mb-5">
          <SectionTitle>Skills</SectionTitle>
          {skills.technical.length > 0 && (
            <p className="text-sm">
              <span className="font-medium">Technical: </span>
              {skills.technical.join(", ")}
            </p>
          )}
          {skills.soft.length > 0 && (
            <p className="text-sm">
              <span className="font-medium">Soft: </span>
              {skills.soft.join(", ")}
            </p>
          )}
          {skills.languages.length > 0 && (
            <p className="text-sm">
              <span className="font-medium">Languages: </span>
              {skills.languages.map((l) => `${l.name} (${l.level})`).join(", ")}
            </p>
          )}
        </section>
      )}

      {certifications.length > 0 && (
        <section className="mb-5">
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
