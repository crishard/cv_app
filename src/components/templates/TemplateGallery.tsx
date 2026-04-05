import { TEMPLATES, TemplateId } from "@/types/cv";

interface Props {
  selected: TemplateId | null;
  onSelect: (id: TemplateId) => void;
}

function ModernPreview() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Header bar */}
      <rect x="0" y="0" width="200" height="36" fill="#1e293b" />
      <rect x="12" y="10" width="80" height="7" rx="2" fill="#f1f5f9" />
      <rect x="12" y="22" width="50" height="4" rx="1" fill="#94a3b8" />
      {/* Accent line */}
      <rect x="0" y="36" width="200" height="3" fill="#3b82f6" />
      {/* Body */}
      <rect x="12" y="48" width="40" height="4" rx="1" fill="#3b82f6" />
      <rect x="12" y="57" width="110" height="3" rx="1" fill="#cbd5e1" />
      <rect x="12" y="64" width="95" height="3" rx="1" fill="#cbd5e1" />
      <rect x="12" y="71" width="105" height="3" rx="1" fill="#cbd5e1" />
      {/* Section 2 */}
      <rect x="12" y="84" width="40" height="4" rx="1" fill="#3b82f6" />
      <rect x="12" y="93" width="80" height="3" rx="1" fill="#cbd5e1" />
      <rect x="12" y="100" width="70" height="3" rx="1" fill="#cbd5e1" />
      {/* Skills pills */}
      <rect x="12" y="113" width="28" height="10" rx="5" fill="#dbeafe" />
      <rect x="44" y="113" width="32" height="10" rx="5" fill="#dbeafe" />
      <rect x="80" y="113" width="24" height="10" rx="5" fill="#dbeafe" />
    </svg>
  );
}

function ClassicPreview() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Header centered */}
      <rect x="40" y="10" width="120" height="7" rx="2" fill="#1e293b" />
      <rect x="60" y="21" width="80" height="4" rx="1" fill="#64748b" />
      <rect x="50" y="29" width="100" height="3" rx="1" fill="#94a3b8" />
      {/* Divider */}
      <rect x="12" y="38" width="176" height="1" fill="#1e293b" />
      {/* Section */}
      <rect x="12" y="46" width="50" height="4" rx="1" fill="#1e293b" />
      <rect x="12" y="54" width="176" height="1" fill="#e2e8f0" />
      <rect x="12" y="60" width="130" height="3" rx="1" fill="#cbd5e1" />
      <rect x="12" y="67" width="110" height="3" rx="1" fill="#cbd5e1" />
      <rect x="12" y="74" width="120" height="3" rx="1" fill="#cbd5e1" />
      {/* Section 2 */}
      <rect x="12" y="86" width="50" height="4" rx="1" fill="#1e293b" />
      <rect x="12" y="94" width="176" height="1" fill="#e2e8f0" />
      <rect x="12" y="100" width="100" height="3" rx="1" fill="#cbd5e1" />
      <rect x="12" y="107" width="115" height="3" rx="1" fill="#cbd5e1" />
      {/* Skills */}
      <rect x="12" y="119" width="60" height="3" rx="1" fill="#cbd5e1" />
      <rect x="76" y="119" width="50" height="3" rx="1" fill="#cbd5e1" />
    </svg>
  );
}

function MinimalPreview() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect x="0" y="0" width="200" height="140" fill="#fafafa" />
      {/* Name */}
      <rect x="16" y="16" width="100" height="8" rx="2" fill="#0f172a" />
      <rect x="16" y="28" width="70" height="4" rx="1" fill="#94a3b8" />
      {/* Thin divider */}
      <rect x="16" y="38" width="168" height="0.5" fill="#e2e8f0" />
      {/* Two columns */}
      {/* Left */}
      <rect x="16" y="46" width="35" height="3" rx="1" fill="#0f172a" />
      <rect x="16" y="54" width="70" height="2.5" rx="1" fill="#cbd5e1" />
      <rect x="16" y="60" width="65" height="2.5" rx="1" fill="#cbd5e1" />
      <rect x="16" y="66" width="72" height="2.5" rx="1" fill="#cbd5e1" />
      <rect x="16" y="78" width="35" height="3" rx="1" fill="#0f172a" />
      <rect x="16" y="86" width="68" height="2.5" rx="1" fill="#cbd5e1" />
      <rect x="16" y="92" width="60" height="2.5" rx="1" fill="#cbd5e1" />
      {/* Right column */}
      <rect x="110" y="46" width="35" height="3" rx="1" fill="#0f172a" />
      <rect x="110" y="54" width="60" height="2.5" rx="1" fill="#cbd5e1" />
      <rect x="110" y="60" width="55" height="2.5" rx="1" fill="#cbd5e1" />
      <rect x="110" y="78" width="35" height="3" rx="1" fill="#0f172a" />
      <rect x="110" y="86" width="50" height="2.5" rx="1" fill="#cbd5e1" />
      <rect x="110" y="92" width="58" height="2.5" rx="1" fill="#cbd5e1" />
    </svg>
  );
}

const PREVIEWS: Record<TemplateId, React.FC> = {
  modern: ModernPreview,
  classic: ClassicPreview,
  minimal: MinimalPreview,
};

export function TemplateGallery({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {TEMPLATES.map((template) => {
        const isSelected = selected === template.id;
        const Preview = PREVIEWS[template.id];
        return (
          <button
            key={template.id}
            data-testid={`template-card-${template.id}`}
            aria-selected={isSelected}
            onClick={() => onSelect(template.id)}
            className={`group rounded-xl border-2 p-4 text-left transition-all hover:shadow-lg ${
              isSelected
                ? "border-blue-600 shadow-md shadow-blue-100"
                : "border-zinc-200 bg-white hover:border-zinc-400"
            }`}
          >
            <div
              className={`mb-4 h-36 overflow-hidden rounded-lg border ${
                isSelected ? "border-blue-200" : "border-zinc-100"
              } bg-white`}
            >
              <Preview />
            </div>
            <p className={`font-semibold ${isSelected ? "text-blue-700" : "text-zinc-900"}`}>
              {template.name}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{template.description}</p>
          </button>
        );
      })}
    </div>
  );
}
