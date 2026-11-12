"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { PortfolioContent } from "@repo/db/portfolio"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Switch } from "@workspace/ui/components/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { TextField } from "@/features/site/components/form-fields"
import { useContacts, useSaveContacts } from "@/features/contact/api/contact"

type Contact = PortfolioContent["contacts"][number]

const contactFormSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  value: z.string().trim().min(1, "Value is required"),
  href: z.string().trim().min(1, "Link is required"),
  external: z.boolean(),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

const emptyContact = (): ContactFormValues => ({
  label: "",
  value: "",
  href: "",
  external: true,
})

export function ContactsEditor() {
  const { data } = useContacts()
  if (!data) return null
  return <ContactsForm contacts={data} />
}

function ContactsForm({
  contacts: initialContacts,
}: {
  contacts: Contact[]
}) {
  const [contacts, setContacts] = useState(initialContacts)
  const [editing, setEditing] = useState<ContactFormValues | null>(null)
  const [originalLabel, setOriginalLabel] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Contact | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const saveContacts = useSaveContacts()
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: emptyContact(),
  })

  function openEditor(values: ContactFormValues, label: string | null) {
    form.reset(values)
    setOriginalLabel(label)
    setEditing(values)
  }

  function persist(next: Contact[]) {
    setMessage(null)
    setError(null)
    saveContacts.mutate(
      { contacts: next },
      {
        onSuccess: (result) => {
          if (!result.ok) {
            setError(result.message)
            return
          }
          setContacts(result.data.contacts)
          setEditing(null)
          setOriginalLabel(null)
          setPendingDelete(null)
          setMessage("Saved. The public contact page will update.")
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          onClick={() => openEditor(emptyContact(), null)}
        >
          <Plus />
          Add contact
        </Button>
        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  No contacts yet.
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.label}>
                  <TableCell className="font-medium">{contact.label}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.value}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {contact.external ? "External" : "Direct"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditor(contact, contact.label)}
                      >
                        <Pencil />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPendingDelete(contact)}
                      >
                        <Trash2 />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
            setOriginalLabel(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {originalLabel ? "Edit contact" : "Add contact"}
            </DialogTitle>
            <DialogDescription>
              Email, phone, and social profiles on the public contact page.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit((values) => {
              const nextContact: Contact = {
                label: values.label.trim(),
                value: values.value.trim(),
                href: values.href.trim(),
                external: values.external,
              }
              const withoutOriginal = contacts.filter(
                (item) => item.label !== originalLabel
              )
              if (
                withoutOriginal.some((item) => item.label === nextContact.label)
              ) {
                setError("Each contact needs its own label.")
                return
              }
              const next = originalLabel
                ? contacts.map((item) =>
                    item.label === originalLabel ? nextContact : item
                  )
                : [...contacts, nextContact]
              persist(next)
            })}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <TextField
                control={form.control}
                name="label"
                label="Label"
                id="contact-label"
                placeholder="GitHub"
              />
              <TextField
                control={form.control}
                name="value"
                label="Value"
                id="contact-value"
                placeholder="github.com/username"
              />
              <TextField
                control={form.control}
                name="href"
                label="Link"
                id="contact-href"
                placeholder="https://github.com/username"
              />
              <Controller
                control={form.control}
                name="external"
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <Switch
                      id="contact-external"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <div>
                      <FieldLabel htmlFor="contact-external">
                        Opens in a new tab
                      </FieldLabel>
                      <FieldDescription>
                        Turn this off for email and phone links.
                      </FieldDescription>
                    </div>
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <Button type="submit" disabled={saveContacts.isPending}>
                {saveContacts.isPending ? "Saving..." : "Save contact"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this contact?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `${pendingDelete.label} will be removed from the public site.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={saveContacts.isPending}
              onClick={() => {
                if (!pendingDelete) return
                persist(
                  contacts.filter((item) => item.label !== pendingDelete.label)
                )
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
