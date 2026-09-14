import { useEffect, useState } from 'react'
import { api } from '../api/client'
import CourseCard from '../components/CourseCard'
import Marquee from '../components/Marquee'
import ThemedPage from '../components/ThemedPage'

export default function Catalog() {
  const [courses, setCourses] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/api/courses', { auth: false })
      .then(setCourses)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <ThemedPage variant="catalog">
      <Marquee items={['Story time adventures', 'Printable fun sheets', 'Memory verses and mini games']} />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffd233]">Adventure Galaxy</p>
        <h1 className="mt-2 text-4xl font-display text-white sm:text-5xl">Choose your next Bible adventure</h1>
        <p className="mt-4 max-w-2xl text-sm text-white/76 sm:text-base">
          Explore glowing story worlds, playful challenges, memory verse missions, and printable discoveries waiting across the Rockidz universe.
        </p>

        {error && <p className="mt-6 text-sm text-[#ff8ebf]">Couldn't load activities: {error}</p>}
        {!courses && !error && <p className="mt-10 text-sm text-white/70">Scanning the galaxy for activities…</p>}
        {courses && courses.length === 0 && <p className="mt-10 text-sm text-white/70">New Rockidz adventures are docking soon.</p>}

        {courses && courses.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </ThemedPage>
  )
}
