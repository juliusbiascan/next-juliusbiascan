import { SkillsEditor } from "@/features/skills/components/skills-editor"
import { PageHeading } from "@/features/site/components/page-heading"

export default function SkillsPage() {
  return (
    <>
      <PageHeading
        title="Skill groups"
        description="Categories and skills shown on the public site."
      />
      <SkillsEditor />
    </>
  )
}
