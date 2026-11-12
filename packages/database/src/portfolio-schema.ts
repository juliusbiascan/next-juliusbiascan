import { z } from "zod"

export const portfolioContentSchema = z.object({
  name: z.string().trim().min(1),
  role: z.string().trim().min(1),
  intro: z.string().trim().min(1),
  github: z.object({
    username: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9-]+$/, "Use a GitHub username"),
    href: z.string().trim().url(),
  }),
  navigation: z
    .array(
      z.object({
        href: z.string().trim().min(1),
        label: z.string().trim().min(1),
      })
    )
    .min(1),
  contacts: z.array(
    z.object({
      label: z.string().trim().min(1),
      value: z.string().trim().min(1),
      href: z.string().trim().min(1),
      external: z.boolean(),
    })
  ),
  skills: z.array(
    z.object({
      title: z.string().trim().min(1),
      items: z.array(z.string().trim().min(1)).min(1),
    })
  ),
  projects: z.array(
    z.object({
      id: z.string().trim().min(1),
      title: z.string().trim().min(1),
      summary: z.string().trim().min(1),
      stack: z.array(z.string().trim().min(1)).min(1),
      href: z.string().trim().url(),
    })
  ),
  experience: z.array(
    z.object({
      id: z.string().trim().min(1),
      role: z.string().trim().min(1),
      company: z.string().trim().min(1),
      dates: z.string().trim().min(1),
      summary: z.string().trim().min(1),
    })
  ),
})

export const homeSectionSchema = portfolioContentSchema.pick({
  name: true,
  role: true,
  intro: true,
  github: true,
  navigation: true,
  skills: true,
})

export const projectsSectionSchema = z.object({
  projects: portfolioContentSchema.shape.projects,
})

export const experienceSectionSchema = z.object({
  experience: portfolioContentSchema.shape.experience,
})

export const skillsSectionSchema = z.object({
  skills: portfolioContentSchema.shape.skills,
})

export const contactsSectionSchema = z.object({
  contacts: portfolioContentSchema.shape.contacts,
})

export type PortfolioContent = z.infer<typeof portfolioContentSchema>
export type HomeSection = z.infer<typeof homeSectionSchema>
export type ProjectsSection = z.infer<typeof projectsSectionSchema>
export type ExperienceSection = z.infer<typeof experienceSectionSchema>
export type SkillsSection = z.infer<typeof skillsSectionSchema>
export type ContactsSection = z.infer<typeof contactsSectionSchema>
