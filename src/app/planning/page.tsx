'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface WeekPlan {
  id: string
  weekOf: string
  income: number
  expenses: { category: string; amount: number; description: string }[]
  notes: string
  createdAt: string
}

export default function PlanningPage() {
  const [plans, setPlans] = useState<WeekPlan[]>([])
  const [showForm, setShowForm] = useState(false)
  const [weekOf, setWeekOf] = useState('')
  const [income, setIncome] = useState('')
  const [expenses, setExpenses] = useState([{ category: 'Food', amount: 0, description: '' }])
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('weeklyPlans')
    if (saved) {
      setPlans(JSON.parse(saved))
    }
    const today = new Date().toISOString().split('T')[0]
    setWeekOf(today)
  }, [])

  const addExpense = () => {
    setExpenses([...expenses, { category: 'Food', amount: 0, description: '' }])
  }

  const updateExpense = (index: number, field: string, value: any) => {
    const updated = [...expenses]
    updated[index] = { ...updated[index], [field]: value }
    setExpenses(updated)
  }

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index))
  }

  const savePlan = () => {
    const newPlan: WeekPlan = {
      id: Date.now().toString(),
      weekOf,
      income: parseFloat(income) || 0,
      expenses: expenses.filter(e => e.amount > 0),
      notes,
      createdAt: new Date().toISOString(),
    }
    const updated = [newPlan, ...plans]
    setPlans(updated)
    localStorage.setItem('weeklyPlans', JSON.stringify(updated))
    resetForm()
  }

  const resetForm = () => {
    setIncome('')
    setExpenses([{ category: 'Food', amount: 0, description: '' }])
    setNotes('')
    setShowForm(false)
  }

  const deletePlan = (id: string) => {
    const updated = plans.filter(p => p.id !== id)
    setPlans(updated)
    localStorage.setItem('weeklyPlans', JSON.stringify(updated))
  }

  const getTotalExpenses = (plan: WeekPlan) => {
    return plan.expenses.reduce((sum, e) => sum + e.amount, 0)
  }

  const getBalance = (plan: WeekPlan) => {
    return plan.income - getTotalExpenses(plan)
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-blue-500 hover:underline mb-2 block">← Back</Link>
            <h1 className="text-3xl font-bold">📅 Weekly Planning</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showForm ? 'Cancel' : '+ New Week'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1">Week Of</label>
                <input
                  type="date"
                  value={weekOf}
                  onChange={(e) => setWeekOf(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Expected Income ($)</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold">Planned Expenses</label>
                <button
                  onClick={addExpense}
                  className="text-sm text-blue-500 hover:underline"
                >
                  + Add Expense
                </button>
              </div>
              {expenses.map((expense, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                  <select
                    value={expense.category}
                    onChange={(e) => updateExpense(index, 'category', e.target.value)}
                    className="col-span-3 p-2 border rounded text-sm dark:bg-gray-700"
                  >
                    <option>Food</option>
                    <option>Transport</option>
                    <option>Bills</option>
                    <option>Entertainment</option>
                    <option>Shopping</option>
                    <option>Other</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={expense.amount || ''}
                    onChange={(e) => updateExpense(index, 'amount', parseFloat(e.target.value) || 0)}
                    className="col-span-2 p-2 border rounded text-sm dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={expense.description}
                    onChange={(e) => updateExpense(index, 'description', e.target.value)}
                    className="col-span-6 p-2 border rounded text-sm dark:bg-gray-700"
                  />
                  <button
                    onClick={() => removeExpense(index)}
                    className="col-span-1 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded mb-4 h-20 dark:bg-gray-700"
            />

            <button
              onClick={savePlan}
              disabled={!weekOf}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Save Plan
            </button>
          </div>
        )}

        <div className="space-y-4">
          {plans.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No weekly plans yet. Create your first one!</p>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Week of {new Date(plan.weekOf).toLocaleDateString()}
                    </h3>
                  </div>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div className="bg-green-50 dark:bg-green-900 p-3 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Income</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${plan.income.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900 p-3 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Expenses</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">
                      ${getTotalExpenses(plan).toLocaleString()}
                    </p>
                  </div>
                  <div className={`${getBalance(plan) >= 0 ? 'bg-blue-50 dark:bg-blue-900' : 'bg-orange-50 dark:bg-orange-900'} p-3 rounded`}>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Balance</p>
                    <p className={`text-xl font-bold ${getBalance(plan) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      ${getBalance(plan).toLocaleString()}
                    </p>
                  </div>
                </div>

                {plan.expenses.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Expenses Breakdown:</p>
                    <div className="space-y-1">
                      {plan.expenses.map((exp, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>
                            <span className="font-medium">{exp.category}</span>
                            {exp.description && ` - ${exp.description}`}
                          </span>
                          <span>${exp.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {plan.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">{plan.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
