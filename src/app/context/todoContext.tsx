"use client";
import { createContext, useContext, useState } from "react";
import { Toaster } from "~/components/ui/sonner";
import dotenv from "dotenv";
dotenv.config();

export type Todo = {
  title: string;
  description?: string;
  deadline: Date;
  markedDone: boolean;
};

export type TodoContext = {
  todos: (Todo & { _id: string })[];
  addTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  markDone: (id: string) => Promise<void>;
  fetchTodos: () => Promise<void>;
  loading: boolean;
} | null;

const TodoContext = createContext<TodoContext>(null);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw Error("Wrap it with Todo Provider");
  }
  return context;
};

export default function TodoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [todos, setTodos] = useState<(Todo & { _id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTodos() {
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/todo`, {
        method: "GET",
      });
      if (resp.ok) {
        const data = await resp.json();
        setTodos(data.todos);
      } else {
        setTodos([]);
      }
    } catch (e) {
      console.log(e);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(todo: Todo) {
    try {
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });
      await fetchTodos();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }
  async function deleteTodo(id: string) {
    try {
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/todo/${id}`, {
        method: "DELETE",
      });
      await fetchTodos();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }
  async function markDone(id: string) {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/todo/${id}/toggleStatus`,
        {
          method: "PATCH",
        }
      );
      if (response.ok) {
        await fetchTodos();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <TodoContext.Provider
      value={{ todos, fetchTodos, addTodo, deleteTodo, markDone, loading }}
    >
      <Toaster position="bottom-center" richColors />
      {children}
    </TodoContext.Provider>
  );
}
