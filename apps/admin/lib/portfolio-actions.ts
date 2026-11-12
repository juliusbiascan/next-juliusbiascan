"use server"

import {
  contactsSectionSchema,
  experienceSectionSchema,
  getPortfolio,
  homeSectionSchema,
  projectsSectionSchema,
  savePortfolio,
  skillsSectionSchema,
  type ContactsSection,
  type ExperienceSection,
  type HomeSection,
  type PortfolioContent,
  type ProjectsSection,
  type SkillsSection,
} from "@repo/db"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { publishPortfolio } from "@/lib/pusher"

type SaveSuccess<T> = { ok: true; data: T }
type SaveFailure = { ok: false; message: string }
type SaveResult<T> = SaveSuccess<T> | SaveFailure

async function persist(
  content: PortfolioContent
): Promise<SaveResult<PortfolioContent>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return { ok: false, message: "You need to sign in again." }
  }

  const saved = await savePortfolio(content)
  await publishPortfolio(saved)
  revalidatePath("/", "layout")
  return { ok: true, data: saved }
}

export async function saveHomeSection(
  input: HomeSection
): Promise<SaveResult<HomeSection>> {
  const parsed = homeSectionSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: "Check the home section fields." }
  }

  const current = await getPortfolio()
  const result = await persist({ ...current, ...parsed.data })
  if (!result.ok) return result

  return {
    ok: true,
    data: homeSectionSchema.parse(result.data),
  }
}

export async function saveProjects(
  input: ProjectsSection
): Promise<SaveResult<ProjectsSection>> {
  const parsed = projectsSectionSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: "Check the project fields." }
  }

  const current = await getPortfolio()
  const result = await persist({ ...current, projects: parsed.data.projects })
  if (!result.ok) return result
  return { ok: true, data: { projects: result.data.projects } }
}

export async function saveExperience(
  input: ExperienceSection
): Promise<SaveResult<ExperienceSection>> {
  const parsed = experienceSectionSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: "Check the experience fields." }
  }

  const current = await getPortfolio()
  const result = await persist({
    ...current,
    experience: parsed.data.experience,
  })
  if (!result.ok) return result
  return { ok: true, data: { experience: result.data.experience } }
}

export async function saveSkills(
  input: SkillsSection
): Promise<SaveResult<SkillsSection>> {
  const parsed = skillsSectionSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: "Check the skill fields." }
  }

  const current = await getPortfolio()
  const result = await persist({ ...current, skills: parsed.data.skills })
  if (!result.ok) return result
  return { ok: true, data: { skills: result.data.skills } }
}

export async function saveContacts(
  input: ContactsSection
): Promise<SaveResult<ContactsSection>> {
  const parsed = contactsSectionSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: "Check the contact fields." }
  }

  const current = await getPortfolio()
  const result = await persist({ ...current, contacts: parsed.data.contacts })
  if (!result.ok) return result
  return { ok: true, data: { contacts: result.data.contacts } }
}
