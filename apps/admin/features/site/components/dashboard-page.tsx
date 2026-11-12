"use client"

import { Briefcase, Contact, FolderKanban, Layers } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { usePortfolio } from "@/features/site/api/portfolio"

import { PageHeading } from "./page-heading"

export function DashboardPage() {
  const { data: portfolio } = usePortfolio()
  if (!portfolio) return null

  const skillCount = portfolio.skills.reduce(
    (total, group) => total + group.items.length,
    0
  )
  const stats = [
    {
      label: "Projects",
      value: portfolio.projects.length,
      detail: "Published on the projects page",
      icon: FolderKanban,
    },
    {
      label: "Roles",
      value: portfolio.experience.length,
      detail: "Shown in the experience section",
      icon: Briefcase,
    },
    {
      label: "Contacts",
      value: portfolio.contacts.length,
      detail: "Links on the contact page",
      icon: Contact,
    },
    {
      label: "Skills",
      value: skillCount,
      detail: `${portfolio.skills.length} groups on the home page`,
      icon: Layers,
    },
  ]

  return (
    <>
      <PageHeading
        title="Dashboard"
        description={`Overview of ${portfolio.name}'s public portfolio.`}
      />
      <div className="grid gap-4 px-4 sm:grid-cols-2 xl:grid-cols-4 lg:px-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <stat.icon className="size-4" />
                {stat.label}
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardFooter className="text-sm text-muted-foreground">
              {stat.detail}
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              {portfolio.role}. {portfolio.intro}
            </CardDescription>
          </CardHeader>
          <div className="px-(--card-spacing)">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Stack</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.stack.map((item) => (
                          <Badge key={item} variant="outline">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-sm text-muted-foreground">
                      {project.summary}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </>
  )
}
