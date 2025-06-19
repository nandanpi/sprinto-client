"use client";
import { AddTodoDialog } from "~/components/todos/add-todo";
import { useTodo } from "./context/todoContext";
import { useEffect } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Trash2 } from "lucide-react";

export default function Home() {
  const { todos, fetchTodos, markDone, deleteTodo } = useTodo();

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2 justify-center items-start mx-auto max-w-xl h-screen">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="flex gap-2 p-2 text-white items-start w-full"
          >
            <Checkbox
              checked={todo.markedDone}
              onCheckedChange={async () => {
                await markDone(todo._id);
              }}
            />
            <div className="w-full">
              <div className="flex w-full justify-between">
                <h3 className="-translate-y-1">{todo.title}</h3>
                <div
                  onClick={async () => {
                    await deleteTodo(todo._id);
                  }}
                >
                  <Trash2 className="size-4 text-red-500 hover:cursor-pointer" />
                </div>
              </div>
              {todo.description && (
                <p className="text-xs text-gray-400">{todo.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <AddTodoDialog />
    </>
  );
}
