"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { homeSectionSchema } from "@repo/db/portfolio"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { FieldGroup } from "@workspace/ui/components/field"

import { TextAreaField, TextField } from "@/features/site/components/form-fields"
import { useHome, useSaveHome } from "@/features/home/api/home"

import type { HomeData } from "../services/get-home"

const homeFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  role: z.string().trim().min(1, "Role is required"),
  intro: z.string().trim().min(1, "Introduction is required"),
  githubUsername: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9-]+$/, "Use a GitHub username"),
  githubHref: z.string().trim().url("Enter a valid GitHub URL"),
  navigation: z
    .array(
      z.object({
        label: z.string().trim().min(1, "Label is required"),
        href: z.string().trim().min(1, "Link is required"),
      })
    )
    .min(1, "Add at least one link"),
})

type HomeFormValues = z.infer<typeof homeFormSchema>

function toFormValues(portfolio: HomeData): HomeFormValues {
  return {
    name: portfolio.name,
    role: portfolio.role,
    intro: portfolio.intro,
    githubUsername: portfolio.github.username,
    githubHref: portfolio.github.href,
    navigation: portfolio.navigation.map((item) => ({ ...item })),
  }
}

export function HomeEditor() {
  const { data } = useHome()
  if (!data) return null
  return <HomeForm portfolio={data} />
}

function HomeForm({ portfolio }: { portfolio: HomeData }) {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const saveHome = useSaveHome()
  const form = useForm<HomeFormValues>({
    resolver: zodResolver(homeFormSchema),
    defaultValues: toFormValues(portfolio),
  })
  const navigation = useFieldArray({
    control: form.control,
    name: "navigation",
  })

  function onSubmit(values: HomeFormValues) {
    setMessage(null)
    setError(null)
    const parsed = homeSectionSchema.safeParse({
      name: values.name,
      role: values.role,
      intro: values.intro,
      github: {
        username: values.githubUsername,
        href: values.githubHref,
      },
      navigation: values.navigation,
      skills: portfolio.skills,
    })

    if (!parsed.success) {
      setError("Check the home section fields.")
      return
    }

    saveHome.mutate(parsed.data, {
      onSuccess: (result) => {
        if (!result.ok) {
          setError(result.message)
          return
        }
        form.reset(toFormValues(result.data))
        setMessage("Saved. The public site will update.")
      },
    })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 px-4 lg:px-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Name, role, and introduction shown in the home hero.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                control={form.control}
                name="name"
                label="Name"
                id="home-name"
              />
              <TextField
                control={form.control}
                name="role"
                label="Role"
                id="home-role"
              />
            </div>
            <TextAreaField
              control={form.control}
              name="intro"
              label="Introduction"
              id="home-intro"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                control={form.control}
                name="githubUsername"
                label="GitHub username"
                id="home-github-username"
              />
              <TextField
                control={form.control}
                name="githubHref"
                label="GitHub URL"
                id="home-github-href"
                placeholder="https://github.com/username"
              />
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation</CardTitle>
          <CardDescription>Links in the public site header.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {navigation.fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-4 rounded-lg border p-4 sm:grid-cols-[1fr_1fr_auto]"
            >
              <TextField
                control={form.control}
                name={`navigation.${index}.label`}
                label="Label"
                id={`nav-label-${field.id}`}
              />
              <TextField
                control={form.control}
                name={`navigation.${index}.href`}
                label="Link"
                id={`nav-href-${field.id}`}
                placeholder="/projects"
              />
              <Button
                type="button"
                variant="outline"
                className="sm:mt-6"
                disabled={navigation.fields.length === 1}
                onClick={() => navigation.remove(index)}
              >
                <Trash2 />
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => navigation.append({ label: "", href: "/" })}
          >
            <Plus />
            Add link
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={saveHome.isPending}>
          {saveHome.isPending ? "Saving..." : "Save home section"}
        </Button>
        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </form>
  )
}
