import { CVData } from "@/types/cv";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 border-b border-gray-800 pb-0.5 text-sm font-bold uppercase tracking-wider text-gray-800">
      {children}
    </h2>
  );
}

export function ClassicTemplate({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, certifications } = data;

  return (
    <div className="mx-auto max-w-[794px] bg-white p-10 font-serif text-gray-900">
      <header className="mb-5 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-widest">
          {personalInfo.fullName}
        </h1>
        <p className="mt-1 text-sm">
          {[personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .join(" | ")}
        </p>
        {(personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && (
          <p className="text-sm">
            {[personalInfo.linkedin, personalInfo.github, personalInfo.portfolio]
              .filter(Boolean)
              .join(" | ")}
          </p>
        )}
      </header>

      {personalInfo.summary && (
        <section className="mb-5">
          <SectionTitle>Professional Summary</SectionTitle>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-5">
          <SectionTitle>Professional Experience</SectionTitle>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex items-baseline justify-between">
                <span className="font-bold">{exp.company}</span>
                <span className="text-sm">
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="italic text-sm">{exp.position}</p>
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
                <span className="font-bold">{edu.institution}</span>
                <span className="text-sm">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <p className="italic text-sm">
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
              <span className="font-bold">Technical: </span>
              {skills.technical.join(", ")}
            </p>
          )}
          {skills.soft.length > 0 && (
            <p className="text-sm">
              <span className="font-bold">Soft Skills: </span>
              {skills.soft.join(", ")}
            </p>
          )}
          {skills.languages.length > 0 && (
            <p className="text-sm">
              <span className="font-bold">Languages: </span>
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
              <span className="text-sm font-bold">{cert.name}</span>
              <span className="text-sm">
                {cert.issuer} · {cert.date}
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
