'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  createdAt: string
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [category, setCategory] = useState('Savings')

  useEffect(() => {
    const saved = localStorage.getItem('goals')
    if (saved) {
      setGoals(JSON.parse(saved))
    }
  }, [])

  const saveGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      deadline,
      category,
      createdAt: new Date().toISOString(),
    }
    const updated = [newGoal, ...goals]
    setGoals(updated)
    localStorage.setItem('goals', JSON.stringify(updated))
    resetForm()
  }

  const resetForm = () => {
    setTitle('')
    setTargetAmount('')
    setCurrentAmount('')
    setDeadline('')
    setCategory('Savings')
    setShowForm(false)
  }

  const updateProgress = (id: string, amount: number) => {
    const updated = goals.map(g =>
      g.id === id ? { ...g, currentAmount: amount } : g
    )
    setGoals(updated)
    localStorage.setItem('goals', JSON.stringify(updated))
  }

  const deleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id)
    setGoals(updated)
    localStorage.setItem('goals', JSON.stringify(updated))
  }

  const getProgress = (goal: Goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-blue-500 hover:underline mb-2 block">← Back</Link>
            <h1 className="text-3xl font-bold">🎯 Financial Goals</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showForm ? 'Cancel' : '+ New Goal'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <input
              type="text"
              placeholder="Goal Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700"
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="number"
                placeholder="Target Amount ($)"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700"
              />
              <input
                type="number"
                placeholder="Current Amount ($)"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700"
              >
                <option>Savings</option>
                <option>Investment</option>
                <option>Debt Payoff</option>
                <option>Emergency Fund</option>
                <option>Other</option>
              </select>
            </div>
            <button
              onClick={saveGoal}
              disabled={!title || !targetAmount}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Save Goal
            </button>
          </div>
        )}

        <div className="space-y-4">
          {goals.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No goals set yet. Create your first financial goal!</p>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{goal.title}</h3>
                    <span className="text-sm bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                      {goal.category}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
                    <span>{getProgress(goal).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${getProgress(goal)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                  <input
                    type="number"
                    placeholder="Update amount"
                    className="w-32 p-1 border rounded text-sm dark:bg-gray-700"
                    onBlur={(e) => {
                      if (e.target.value) {
                        updateProgress(goal.id, parseFloat(e.target.value))
                        e.target.value = ''
                      }
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
