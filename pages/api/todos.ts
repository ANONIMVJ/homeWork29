import { NextApiRequest, NextApiResponse } from 'next'

let todos: { id: number; text: string; completed: boolean }[] = []
let id = 0

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  if (method === 'GET') {
    return res.status(200).json(todos)
  }

  if (method === 'POST') {
    const { text } = req.body
    const newTodo = { id: ++id, text, completed: false }
    todos.push(newTodo)
    return res.status(201).json(newTodo)
  }

  if (method === 'PUT') {
    const idToToggle = parseInt(req.query.id as string)
    const todo = todos.find(t => t.id === idToToggle)
    if (todo) {
      todo.completed = !todo.completed
      return res.status(200).json(todo)
    }
    return res.status(404).json({ message: 'Todo not found' })
  }

  if (method === 'DELETE') {
    const idToDelete = parseInt(req.query.id as string)
    todos = todos.filter(t => t.id !== idToDelete)
    return res.status(204).end()
  }

  return res.status(405).end()
}
