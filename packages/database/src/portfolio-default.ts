import {
  portfolioContentSchema,
  type PortfolioContent,
} from "./portfolio-schema"

const githubProfile = {
  username: "juliusbiascan",
  href: "https://github.com/juliusbiascan",
}

export const defaultPortfolio: PortfolioContent = portfolioContentSchema.parse({
  name: "Julius Biascan",
  role: "Independent Software Engineer",
  github: githubProfile,
  intro: "Placeholder. Replace this sentence with a short introduction.",
  navigation: [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/experience", label: "Experience" },
    { href: "/contact", label: "Contact" },
  ],
  contacts: [
    {
      label: "GitHub",
      value: "github.com/juliusbiascan",
      href: githubProfile.href,
      external: true,
    },
    {
      label: "LinkedIn",
      value: "example.com/linkedin",
      href: "https://example.com/linkedin",
      external: true,
    },
    {
      label: "Facebook",
      value: "example.com/facebook",
      href: "https://example.com/facebook",
      external: true,
    },
    {
      label: "Email",
      value: "juliusbiascan.me@gmail.com",
      href: "mailto:juliusbiascan.me@gmail.com",
      external: false,
    },
    {
      label: "Phone",
      value: "+6391655553014",
      href: "tel:+6391655553014",
      external: false,
    },
  ],
  skills: [
    {
      title: "Frontend",
      items: [
        "Next.js",
        "React",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "Bootstrap",
        "Zustand",
        "Zod",
      ],
    },
    {
      title: "Backend",
      items: [
        "Node.js",
        "Express.js",
        "PostgreSQL",
        "MongoDB",
        "PHP",
        "Yii2",
        "SQL",
        "Java",
        "GraphQL",
        "REST API",
      ],
    },
    {
      title: "Testing & QA",
      items: ["Playwright", "Regression Testing", "Postman"],
    },
    {
      title: "DevOps & Tools",
      items: [
        "AWS",
        "Docker",
        "Git",
        "GitHub",
        "Jira",
        "Bitbucket",
        "VS Code",
        "Agile/Scrum",
      ],
    },
  ],
  projects: [
    {
      id: "project-one",
      title: "Placeholder project one",
      summary: "Replace this with a short description of a real project.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS"],
      href: "https://example.com/project-one",
    },
    {
      id: "project-two",
      title: "Placeholder project two",
      summary: "Replace this with a short description of a real project.",
      stack: ["Node.js", "PostgreSQL", "REST API"],
      href: "https://example.com/project-two",
    },
    {
      id: "project-three",
      title: "Placeholder project three",
      summary: "Replace this with a short description of a real project.",
      stack: ["React", "Playwright", "Docker"],
      href: "https://example.com/project-three",
    },
  ],
  experience: [
    {
      id: "role-one",
      role: "Placeholder role",
      company: "Placeholder company",
      dates: "Year — Year",
      summary: "Replace this with what you did in this role.",
    },
    {
      id: "role-two",
      role: "Placeholder role",
      company: "Placeholder company",
      dates: "Year — Year",
      summary: "Replace this with what you did in this role.",
    },
  ],
})
