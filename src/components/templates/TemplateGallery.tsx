import { TEMPLATES, TemplateId } from "@/types/cv";

interface Props {
  selected: TemplateId | null;
  onSelect: (id: TemplateId) => void;
}

export function TemplateGallery({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {TEMPLATES.map((template) => {
        const isSelected = selected === template.id;
        return (
          <button
            key={template.id}
            data-testid={`template-card-${template.id}`}
            aria-selected={isSelected}
            onClick={() => onSelect(template.id)}
            className={`rounded-xl border-2 p-5 text-left transition-all hover:shadow-md ${
              isSelected
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div
              className={`mb-3 h-32 rounded-md bg-gray-100 ${
                isSelected ? "ring-2 ring-blue-400" : ""
              }`}
            />
            <p className="font-semibold">{template.name}</p>
            <p className="mt-1 text-sm text-gray-500">{template.description}</p>
          </button>
        );
      })}
    </div>
  );
}
