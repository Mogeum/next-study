export function getDoneLabel(done: boolean) {
  return done ? "완료" : "미완료";
}

export interface Todo {
  id: number;
  title: string;
  done: boolean;
  userId: number;
  createdAt: string;
}

export interface CreateTodoBody {
  title: string;
}

export interface UpdateTodoBody {
  title?: string;
}
