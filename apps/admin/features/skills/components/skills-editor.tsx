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
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { TextAreaField, TextField } from "@/features/site/components/form-fields"

import { useSaveSkills, useSkills } from "../api/skills"

type SkillGroup = PortfolioContent["skills"][number]

const skillFormSchema = z.object({
  category: z.string().trim().min(1, "Category is required"),
  items: z.string().trim().min(1, "Add at least one skill"),
})

type SkillFormValues = z.infer<typeof skillFormSchema>

const emptyGroup = (): SkillFormValues => ({
  category: "",
  items: "",
})

function toForm(group: SkillGroup): SkillFormValues {
  return {
    category: group.title,
    items: group.items.join("\n"),
  }
}

function toGroup(values: SkillFormValues): SkillGroup {
  return {
    title: values.category.trim(),
    items: values.items
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
  }
}

export function SkillsEditor() {
  const { data } = useSkills()
  if (!data) return null
  return <SkillsForm skills={data} />
}

function SkillsForm({ skills: initialSkills }: { skills: SkillGroup[] }) {
  const [skills, setSkills] = useState(initialSkills)
  const [query, setQuery] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const saveSkills = useSaveSkills()
  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: emptyGroup(),
  })

  const needle = query.trim().toLowerCase()
  const rows = skills
    .map((group, index) => ({ group, index }))
    .filter(({ group }) => {
      if (!needle) return true
      return (
        group.title.toLowerCase().includes(needle) ||
        group.items.some((item) => item.toLowerCase().includes(needle))
      )
    })

  function openEditor(index: number | null) {
    form.reset(index === null ? emptyGroup() : toForm(skills[index]!))
    setCreating(index === null)
    setEditingIndex(index)
  }

  function closeEditor() {
    setCreating(false)
    setEditingIndex(null)
  }

  function persist(next: SkillGroup[]) {
    setMessage(null)
    setError(null)
    saveSkills.mutate(
      { skills: next },
      {
        onSuccess: (result) => {
          if (!result.ok) {
            setError(result.message)
            return
          }
          setSkills(result.data.skills)
          closeEditor()
          setPendingDelete(null)
          setMessage("Saved. The public site will update.")
        },
      }
    )
  }

  function onSubmit(values: SkillFormValues) {
    const group = toGroup(values)
    if (group.items.length === 0) {
      form.setError("items", { message: "Add at least one skill" })
      return
    }

    const next =
      editingIndex === null
        ? [...skills, group]
        : skills.map((item, index) => (index === editingIndex ? group : item))
    persist(next)
  }

  const editorOpen = creating || editingIndex !== null

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" onClick={() => openEditor(null)}>
            <Plus />
            Add skill group
          </Button>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by category or skill"
            aria-label="Filter skill groups"
            className="w-64"
          />
        </div>
        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground">
                  {skills.length === 0
                    ? "No skill groups yet."
                    : "No skill groups match this filter."}
                </TableCell>
              </TableRow>
            ) : (
              rows.map(({ group, index }) => (
                <TableRow key={`${group.title}-${index}`}>
                  <TableCell className="font-medium">{group.title}</TableCell>
                  <TableCell className="whitespace-normal">
                    <div className="flex max-w-xl flex-wrap gap-1">
                      {group.items.map((item) => (
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
                        onClick={() => openEditor(index)}
                      >
                        <Pencil />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPendingDelete(index)}
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
        open={editorOpen}
        onOpenChange={(open) => {
          if (!open) closeEditor()
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingIndex === null ? "Add skill group" : "Edit skill group"}
            </DialogTitle>
            <DialogDescription>
              One skill per line. This appears in the home marquee and on the
              public experience page.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <TextField
                control={form.control}
                name="category"
                label="Category"
                id="skill-category"
              />
              <TextAreaField
                control={form.control}
                name="items"
                label="Skills"
                id="skill-items"
                placeholder={"Next.js\nTypeScript"}
              />
            </FieldGroup>
            <DialogFooter>
              <Button type="submit" disabled={saveSkills.isPending}>
                {saveSkills.isPending ? "Saving..." : "Save skill group"}
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
            <AlertDialogTitle>Delete this skill group?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete !== null && skills[pendingDelete]
                ? `${skills[pendingDelete].title} will be removed from the public site.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={saveSkills.isPending}
              onClick={() => {
                if (pendingDelete === null) return
                persist(skills.filter((_, index) => index !== pendingDelete))
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
