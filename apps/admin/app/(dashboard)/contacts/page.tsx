import { ContactsEditor } from "@/features/contact/components/contacts-editor"
import { PageHeading } from "@/features/site/components/page-heading"

export default function ContactsPage() {
  return (
    <>
      <PageHeading
        title="Contacts"
        description="Ways to reach you from the public contact page."
      />
      <ContactsEditor />
    </>
  )
}
