"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { PortfolioContent } from "@repo/db/portfolio"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
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
  useSaveSkills,
} from "@/features/experience/api/experience"

type Role = PortfolioContent["experience"][number]
type SkillGroup = PortfolioContent["skills"][number]

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

const skillsFormSchema = z.object({
  skills: z.array(
    z.object({
      title: z.string().trim().min(1, "Title is required"),
      items: z.string().trim().min(1, "Add at least one skill"),
    })
  ),
})

type SkillsFormValues = z.infer<typeof skillsFormSchema>

function toSkillForm(skills: SkillGroup[]): SkillsFormValues {
  return {
    skills: skills.map((group) => ({
      title: group.title,
      items: group.items.join("\n"),
    })),
  }
}

export function ExperienceEditor() {
  const { data } = useExperience()
  if (!data) return null
  return <ExperienceForm experience={data.jobs} skills={data.skills} />
}

function ExperienceForm({
  experience: initialExperience,
  skills: initialSkills,
}: {
  experience: Role[]
  skills: SkillGroup[]
}) {
  const [experience, setExperience] = useState(initialExperience)
  const [skillsMessage, setSkillsMessage] = useState<string | null>(null)
  const [skillsError, setSkillsError] = useState<string | null>(null)
  const saveSkills = useSaveSkills()
  const saveExperience = useSaveExperience()
  const skillsForm = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: toSkillForm(initialSkills),
  })
  const skillGroups = useFieldArray({
    control: skillsForm.control,
    name: "skills",
  })
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

  function onSaveSkills(values: SkillsFormValues) {
    setSkillsMessage(null)
    setSkillsError(null)
    const skills = values.skills.map((group) => ({
      title: group.title.trim(),
      items: group.items
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    }))

    saveSkills.mutate(
      { skills },
      {
        onSuccess: (result) => {
          if (!result.ok) {
            setSkillsError(result.message)
            return
          }
          skillsForm.reset(toSkillForm(result.data.skills))
          setSkillsMessage("Saved. The public experience page will update.")
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

      <form
        onSubmit={skillsForm.handleSubmit(onSaveSkills)}
        className="flex flex-col gap-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {skillGroups.fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader>
                <CardTitle>Skill group</CardTitle>
                <CardDescription>
                  One skill per line. Shown with these roles on the public
                  experience page and in the home marquee.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <TextField
                    control={skillsForm.control}
                    name={`skills.${index}.title`}
                    label="Title"
                    id={`experience-skill-title-${field.id}`}
                  />
                  <TextAreaField
                    control={skillsForm.control}
                    name={`skills.${index}.items`}
                    label="Skills"
                    id={`experience-skill-items-${field.id}`}
                    placeholder={"Next.js\nTypeScript"}
                  />
                </FieldGroup>
              </CardContent>
              <CardFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => skillGroups.remove(index)}
                >
                  <Trash2 />
                  Remove group
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => skillGroups.append({ title: "", items: "" })}
          >
            <Plus />
            Add skill group
          </Button>
          <Button type="submit" disabled={saveSkills.isPending}>
            {saveSkills.isPending ? "Saving..." : "Save skill groups"}
          </Button>
          {skillsMessage ? (
            <p className="text-sm text-muted-foreground">{skillsMessage}</p>
          ) : null}
          {skillsError ? (
            <p className="text-sm text-destructive">{skillsError}</p>
          ) : null}
        </div>
      </form>

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
