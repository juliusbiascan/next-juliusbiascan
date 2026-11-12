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
import { useProjects, useSaveProjects } from "@/features/projects/api/projects"

type Project = PortfolioContent["projects"][number]

const projectFormSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Title is required"),
  summary: z.string().trim().min(1, "Summary is required"),
  stack: z.string().trim().min(1, "Add at least one technology"),
  href: z.string().trim().url("Enter a valid project URL"),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

const emptyProject = (): ProjectFormValues => ({
  id: crypto.randomUUID(),
  title: "",
  summary: "",
  stack: "",
  href: "",
})

function toForm(project: Project): ProjectFormValues {
  return {
    id: project.id,
    title: project.title,
    summary: project.summary,
    stack: project.stack.join(", "),
    href: project.href,
  }
}

export function ProjectsEditor() {
  const { data } = useProjects()
  if (!data) return null
  return <ProjectsForm projects={data} />
}

function ProjectsForm({
  projects: initialProjects,
}: {
  projects: Project[]
}) {
  const [projects, setProjects] = useState(initialProjects)
  const [editing, setEditing] = useState<ProjectFormValues | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const saveProjects = useSaveProjects()
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: emptyProject(),
  })

  function openEditor(values: ProjectFormValues) {
    form.reset(values)
    setEditing(values)
  }

  function persist(next: Project[]) {
    setMessage(null)
    setError(null)
    saveProjects.mutate(
      { projects: next },
      {
        onSuccess: (result) => {
          if (!result.ok) {
            setError(result.message)
            return
          }
          setProjects(result.data.projects)
          setEditing(null)
          setPendingDelete(null)
          setMessage("Saved. The public projects page will update.")
        },
      }
    )
  }

  function onSubmit(values: ProjectFormValues) {
    const project: Project = {
      id: values.id,
      title: values.title.trim(),
      summary: values.summary.trim(),
      stack: values.stack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      href: values.href.trim(),
    }
    const exists = projects.some((item) => item.id === project.id)
    const next = exists
      ? projects.map((item) => (item.id === project.id ? project : item))
      : [...projects, project]
    persist(next)
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" onClick={() => openEditor(emptyProject())}>
          <Plus />
          Add project
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
              <TableHead>Title</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Stack</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  No projects yet.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell className="max-w-sm text-muted-foreground">
                    {project.summary}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.stack.map((item) => (
                        <Badge key={item} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditor(toForm(project))}
                      >
                        <Pencil />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPendingDelete(project)}
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
              {projects.some((item) => item.id === editing?.id)
                ? "Edit project"
                : "Add project"}
            </DialogTitle>
            <DialogDescription>
              This appears on the public projects page.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <TextField
                control={form.control}
                name="title"
                label="Title"
                id="project-title"
              />
              <TextAreaField
                control={form.control}
                name="summary"
                label="Summary"
                id="project-summary"
              />
              <TextField
                control={form.control}
                name="stack"
                label="Stack"
                id="project-stack"
                placeholder="Next.js, TypeScript, Tailwind CSS"
              />
              <TextField
                control={form.control}
                name="href"
                label="Link"
                id="project-href"
                placeholder="https://example.com"
              />
            </FieldGroup>
            <DialogFooter>
              <Button type="submit" disabled={saveProjects.isPending}>
                {saveProjects.isPending ? "Saving..." : "Save project"}
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
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `${pendingDelete.title} will be removed from the public site.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={saveProjects.isPending}
              onClick={() => {
                if (!pendingDelete) return
                persist(
                  projects.filter((item) => item.id !== pendingDelete.id)
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
