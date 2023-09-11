import { and, eq } from "drizzle-orm";

import db from "../db";
import { User, projects } from "../db/schema";
import { BadRequestException, NotFoundException } from "../utils/errors";
import { CreateProjectInput } from "../validators/projects";

export async function find(user: User) {
  const results = await db.query.projects.findMany({
    where: eq(projects.userId, user.id),
    with: {
      user: {
        columns: {
          password: false,
        },
      },
    },
  });

  return results;
}

export async function findById(user: User, id: number) {
  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, id), eq(projects.userId, user.id)),
    with: {
      user: {
        columns: {
          password: false,
        },
      },
    },
  });

  if (!project) {
    throw new NotFoundException(`Project ${id} not found.`);
  }

  return project;
}

export async function create(user: User, input: CreateProjectInput) {
  await checkProjectExists(user, input.name);

  const [project] = await db
    .insert(projects)
    .values({ name: input.name, userId: user.id })
    .returning()
    .execute();

  return project;
}

export async function update(
  user: User,
  id: number,
  input: CreateProjectInput
) {
  await findById(user, id);

  const [project] = await db
    .update(projects)
    .set({ name: input.name })
    .where(eq(projects.id, id))
    .returning()
    .execute();

  return project;
}

export async function deleteById(user: User, id: number) {
  const project = await findById(user, id);

  await db.delete(projects).where(eq(projects.id, id)).execute();

  return project;
}

async function checkProjectExists(user: User, name: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.name, name))
    .where(eq(projects.userId, user.id));

  if (project) {
    throw new BadRequestException(`Project ${name} already exists.`);
  }

  return project;
}
