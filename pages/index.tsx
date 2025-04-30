import { useEffect, useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState('')

  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
  }, [])

  const addTodo = async () => {
    if (!text.trim()) return
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const newTodo = await res.json()
    setTodos(prev => [...prev, newTodo])
    setText('')
  }

  const toggleComplete = async (id: number) => {
    const res = await fetch(`/api/todos?id=${id}`, { method: 'PUT' })
    const updated = await res.json()
    setTodos(prev => prev.map(t => t.id === id ? updated : t))
  }

  const deleteTodo = async (id: number) => {
    await fetch(`/api/todos?id=${id}`, { method: 'DELETE' })
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  return (
    <main className="min-h-screen bg-black text-teal-300 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center border-b border-teal-500 pb-2">
          📝Todo App
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 px-3 py-2 border border-teal-500 bg-black text-teal-300 placeholder-teal-600 rounded"
            placeholder="Add todo..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button
            onClick={addTodo}
            className="bg-teal-500 hover:bg-teal-600 text-black font-bold px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="flex justify-between items-center border border-teal-500 p-3 rounded transition-all hover:bg-teal-900/20"
            >
              <span
                onClick={() => toggleComplete(todo.id)}
                className={`flex-1 cursor-pointer ${todo.completed ? 'line-through text-teal-700' : ''}`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="ml-3 text-teal-400 hover:text-red-400 transition"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
