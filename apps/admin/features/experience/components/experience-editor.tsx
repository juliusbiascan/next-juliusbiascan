"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { PortfolioContent } from "@repo/db/portfolio"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
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
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { FieldGroup } from "@workspace/ui/components/field"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { TextAreaField, TextField } from "@/features/site/components/form-fields"
import {
  useExperience,
  useSaveExperience,
} from "@/features/experience/api/experience"

type Role = PortfolioContent["experience"][number]

const roleFormSchema = z.object({
  id: z.string().min(1),
  role: z.string().trim().min(1, "Role is required"),
  company: z.string().trim().min(1, "Company is required"),
  dates: z.string().trim().min(1, "Dates are required"),
  summary: z.string().trim().min(1, "Summary is required"),
})

type RoleFormValues = z.infer<typeof roleFormSchema>

const emptyRole = (): RoleFormValues => ({
  id: crypto.randomUUID(),
  role: "",
  company: "",
  dates: "",
  summary: "",
})

export function ExperienceEditor() {
  const { data } = useExperience()
  if (!data) return null
  return <ExperienceForm experience={data.jobs} />
}

function ExperienceForm({
  experience: initialExperience,
}: {
  experience: Role[]
}) {
  const [experience, setExperience] = useState(initialExperience)
  const saveExperience = useSaveExperience()
  const [editing, setEditing] = useState<RoleFormValues | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Role | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: emptyRole(),
  })

  function openEditor(values: RoleFormValues) {
    form.reset(values)
    setEditing(values)
  }

  function persist(next: Role[]) {
    setMessage(null)
    setError(null)
    saveExperience.mutate(
      { experience: next },
      {
        onSuccess: (result) => {
          if (!result.ok) {
            setError(result.message)
            return
          }
          setExperience(result.data.experience)
          setEditing(null)
          setPendingDelete(null)
          setMessage("Saved. The public experience page will update.")
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" onClick={() => openEditor(emptyRole())}>
          <Plus />
          Add role
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
              <TableHead>Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experience.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No roles yet.
                </TableCell>
              </TableRow>
            ) : (
              experience.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.role}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.dates}
                  </TableCell>
                  <TableCell className="max-w-sm text-muted-foreground">
                    {job.summary}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditor(job)}
                      >
                        <Pencil />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPendingDelete(job)}
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
          if (!open) setEditing(null)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {experience.some((item) => item.id === editing?.id)
                ? "Edit role"
                : "Add role"}
            </DialogTitle>
            <DialogDescription>
              This appears on the public experience page.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit((values) =>
              persist(
                experience.some((item) => item.id === values.id)
                  ? experience.map((item) =>
                      item.id === values.id ? values : item
                    )
                  : [...experience, values]
              )
            )}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <TextField
                control={form.control}
                name="role"
                label="Role"
                id="experience-role"
              />
              <TextField
                control={form.control}
                name="company"
                label="Company"
                id="experience-company"
              />
              <TextField
                control={form.control}
                name="dates"
                label="Dates"
                id="experience-dates"
                placeholder="2022 — Present"
              />
              <TextAreaField
                control={form.control}
                name="summary"
                label="Summary"
                id="experience-summary"
              />
            </FieldGroup>
            <DialogFooter>
              <Button type="submit" disabled={saveExperience.isPending}>
                {saveExperience.isPending ? "Saving..." : "Save role"}
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
            <AlertDialogTitle>Delete this role?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `${pendingDelete.role} at ${pendingDelete.company} will be removed from the public site.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={saveExperience.isPending}
              onClick={() => {
                if (!pendingDelete) return
                persist(
                  experience.filter((item) => item.id !== pendingDelete.id)
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
