'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Blog {
  id: string
  title: string
  url: string
  notes: string
  addedAt: string
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('blogs')
    if (saved) {
      setBlogs(JSON.parse(saved))
    }
  }, [])

  const saveBlog = () => {
    const newBlog: Blog = {
      id: Date.now().toString(),
      title,
      url,
      notes,
      addedAt: new Date().toISOString(),
    }
    const updated = [newBlog, ...blogs]
    setBlogs(updated)
    localStorage.setItem('blogs', JSON.stringify(updated))
    setTitle('')
    setUrl('')
    setNotes('')
    setShowForm(false)
  }

  const deleteBlog = (id: string) => {
    const updated = blogs.filter(b => b.id !== id)
    setBlogs(updated)
    localStorage.setItem('blogs', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-blue-500 hover:underline mb-2 block">← Back</Link>
            <h1 className="text-3xl font-bold">📚 Favorite Blogs</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showForm ? 'Cancel' : '+ Add Blog'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700"
            />
            <input
              type="url"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700"
            />
            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded mb-4 h-24 dark:bg-gray-700"
            />
            <button
              onClick={saveBlog}
              disabled={!title || !url}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Save
            </button>
          </div>
        )}

        <div className="space-y-4">
          {blogs.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No blogs saved yet. Add your first one!</p>
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                    <a
                      href={blog.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline break-all"
                    >
                      {blog.url}
                    </a>
                    {blog.notes && <p className="mt-2 text-gray-600">{blog.notes}</p>}
                    <p className="text-sm text-gray-400 mt-2">
                      Added: {new Date(blog.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteBlog(blog.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
