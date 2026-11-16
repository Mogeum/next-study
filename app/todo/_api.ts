import { httpClient } from "@/app/_libs/http-client";
import type { Todo, CreateTodoBody, UpdateTodoBody } from "./_model";

export async function getTodos() {
  return httpClient.get<Todo[]>("/todos");
}

export async function createTodo(body: CreateTodoBody) {
  return httpClient.post<Todo>("/todos", body);
}

export async function updateTodo(id: number, body: UpdateTodoBody) {
  return httpClient.put<Todo>(`/todos/${id}`, body);
}

export async function updateDoneTodo(id: number) {
  return httpClient.patch<Todo>(`/todos/${id}/done`);
}

export async function deleteTodo(id: number) {
  return httpClient.delete<Todo>(`/todos/${id}`);
}
