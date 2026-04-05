import { CVData, TemplateId } from "@/types/cv";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";

const TEMPLATE_MAP = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
};

interface Props {
  data: CVData;
  templateId: TemplateId;
}

export function ReviewStep({ data, templateId }: Props) {
  const Template = TEMPLATE_MAP[templateId];
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Review</h2>
      <p className="text-sm text-gray-500">
        This is how your CV will look. Go back to make any changes.
      </p>
      <div className="overflow-auto rounded-xl border bg-white shadow-sm">
        <Template data={data} />
      </div>
    </div>
  );
}
