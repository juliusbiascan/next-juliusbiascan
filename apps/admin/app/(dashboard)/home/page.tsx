import { HomeEditor } from "@/features/home/components/home-editor"
import { PageHeading } from "@/features/site/components/page-heading"

export default function HomeSectionPage() {
  return (
    <>
      <PageHeading
        title="Home Section"
        description="Copy, navigation, and skills published on the portfolio home page."
      />
      <HomeEditor />
    </>
  )
}
