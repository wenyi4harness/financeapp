'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Review {
  id: string
  weekOf: string
  financialPerformance: string
  newsHighlights: string
  learnings: string
  nextWeekGoals: string
  rating: number
  createdAt: string
}

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showForm, setShowForm] = useState(false)
  const [weekOf, setWeekOf] = useState('')
  const [financialPerformance, setFinancialPerformance] = useState('')
  const [newsHighlights, setNewsHighlights] = useState('')
  const [learnings, setLearnings] = useState('')
  const [nextWeekGoals, setNextWeekGoals] = useState('')
  const [rating, setRating] = useState(3)

  useEffect(() => {
    const saved = localStorage.getItem('reviews')
    if (saved) {
      setReviews(JSON.parse(saved))
    }
    const today = new Date().toISOString().split('T')[0]
    setWeekOf(today)
  }, [])

  const saveReview = () => {
    const newReview: Review = {
      id: Date.now().toString(),
      weekOf,
      financialPerformance,
      newsHighlights,
      learnings,
      nextWeekGoals,
      rating,
      createdAt: new Date().toISOString(),
    }
    const updated = [newReview, ...reviews]
    setReviews(updated)
    localStorage.setItem('reviews', JSON.stringify(updated))
    resetForm()
  }

  const resetForm = () => {
    setFinancialPerformance('')
    setNewsHighlights('')
    setLearnings('')
    setNextWeekGoals('')
    setRating(3)
    setShowForm(false)
  }

  const deleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id)
    setReviews(updated)
    localStorage.setItem('reviews', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-blue-500 hover:underline mb-2 block">← Back</Link>
            <h1 className="text-3xl font-bold">📰 Weekly Review</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showForm ? 'Cancel' : '+ New Review'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <div className="mb-4">
              <label className="block text-sm mb-1">Week Of</label>
              <input
                type="date"
                value={weekOf}
                onChange={(e) => setWeekOf(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">How did I do financially?</label>
              <textarea
                placeholder="Review your income, expenses, savings this week..."
                value={financialPerformance}
                onChange={(e) => setFinancialPerformance(e.target.value)}
                className="w-full p-2 border rounded h-24 dark:bg-gray-700"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Financial News Highlights</label>
              <textarea
                placeholder="Key financial news or market movements you noticed..."
                value={newsHighlights}
                onChange={(e) => setNewsHighlights(e.target.value)}
                className="w-full p-2 border rounded h-24 dark:bg-gray-700"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Key Learnings</label>
              <textarea
                placeholder="What did you learn this week about money management?"
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                className="w-full p-2 border rounded h-24 dark:bg-gray-700"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Goals for Next Week</label>
              <textarea
                placeholder="What will you focus on next week?"
                value={nextWeekGoals}
                onChange={(e) => setNextWeekGoals(e.target.value)}
                className="w-full p-2 border rounded h-24 dark:bg-gray-700"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Overall Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-3xl"
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={saveReview}
              disabled={!weekOf}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Save Review
            </button>
          </div>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No reviews yet. Create your first weekly review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Week of {new Date(review.weekOf).toLocaleDateString()}
                    </h3>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-xl">
                          {star <= review.rating ? '⭐' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>

                {review.financialPerformance && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Financial Performance:</p>
                    <p className="text-sm mt-1">{review.financialPerformance}</p>
                  </div>
                )}

                {review.newsHighlights && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">News Highlights:</p>
                    <p className="text-sm mt-1">{review.newsHighlights}</p>
                  </div>
                )}

                {review.learnings && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Key Learnings:</p>
                    <p className="text-sm mt-1">{review.learnings}</p>
                  </div>
                )}

                {review.nextWeekGoals && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Next Week Goals:</p>
                    <p className="text-sm mt-1">{review.nextWeekGoals}</p>
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
