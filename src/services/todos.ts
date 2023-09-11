import { and, eq } from "drizzle-orm";

import db from "../db";
import { User, todos } from "../db/schema";
import { NotFoundException } from "../utils/errors";
import { CreateTodoInput } from "../validators/todos";
import { findById as projectsById } from "./projects";

export async function find(projectId: number) {
  const results = await db.query.todos.findMany({
    where: eq(todos.projectId, projectId),
  });

  return results;
}

export async function findById(id: number, projectId: number) {
  const todo = await db.query.todos.findFirst({
    where: and(eq(todos.id, id), eq(todos.projectId, projectId)),
  });

  if (!todo) {
    throw new NotFoundException(`Todo with ${id} not found.`);
  }

  return todo;
}

export async function create(
  user: User,
  projectId: number,
  input: CreateTodoInput
) {
  await projectsById(user, projectId);

  const [todo] = await db
    .insert(todos)
    .values({ title: input.title, projectId })
    .returning()
    .execute();

  return todo;
}

export async function update(
  id: number,
  projectId: number,
  input: CreateTodoInput
) {
  const [todo] = await db
    .update(todos)
    .set({ title: input.title })
    .where(and(eq(todos.id, id), eq(todos.projectId, projectId)))
    .returning()
    .execute();

  return todo;
}

export async function deleteById(id: number, projectId: number) {
  const todo = await findById(id, projectId);

  await db.delete(todos).where(eq(todos.id, id)).execute();

  return todo;
}

export async function toggleTodo(id: number, projectId: number) {
  const todo = await findById(id, projectId);

  const [updatedTodo] = await db
    .update(todos)
    .set({ done: !todo.done })
    .where(and(eq(todos.id, id), eq(todos.projectId, projectId)))
    .returning()
    .execute();

  return updatedTodo;
}
