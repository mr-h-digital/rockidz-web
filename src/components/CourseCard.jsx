import { Link } from 'react-router-dom'
import { resolveApiUrl } from '../api/client'

const davidCoverUrl = `${import.meta.env.BASE_URL}david-and-goliath-program-cover-image.webp`

export default function CourseCard({ course }) {
  const useProvidedArtwork = course.slug === 'david-and-goliath'

  return (
    <Link
      to={`/activities/${course.slug}`}
      className="group block overflow-hidden rounded-[1.75rem] border border-white/18 bg-[linear-gradient(180deg,rgba(23,12,73,0.88)_0%,rgba(11,43,88,0.82)_100%)] shadow-[0_18px_40px_rgba(4,4,28,0.28)] transition-all hover:-translate-y-1 hover:border-[#5fe7ff]/35 hover:shadow-[0_28px_56px_rgba(0,184,255,0.18)]"
    >
      <div className="relative flex aspect-[16/11] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,rgba(22,14,84,0.95)_0%,rgba(66,20,124,0.9)_38%,rgba(6,104,168,0.88)_72%,rgba(255,79,163,0.82)_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.18)_0_2px,transparent_3px),radial-gradient(circle_at_82%_20%,rgba(255,255,255,0.16)_0_2px,transparent_3px),radial-gradient(circle_at_28%_78%,rgba(255,210,51,0.24)_0_4px,transparent_5px),radial-gradient(circle_at_72%_72%,rgba(95,231,255,0.22)_0_4px,transparent_5px)] opacity-80" />
        <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-[#ffd233] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#7a4200] shadow-[0_12px_22px_rgba(255,210,51,0.2)]">
          Adventure galaxy
        </div>
        {course.thumbnailUrl ? (
          <img src={resolveApiUrl(course.thumbnailUrl)} alt="" className="relative z-[1] h-full w-full object-cover" />
        ) : useProvidedArtwork ? (
          <img src={davidCoverUrl} alt="" className="relative z-[1] h-full w-full object-cover" />
        ) : (
          <span className="relative z-[1] text-6xl drop-shadow-[0_16px_30px_rgba(0,0,0,0.35)]">{emojiForCourse(course.title)}</span>
        )}
      </div>
      <div className="p-5 text-white">
        <h3 className="font-display text-2xl text-white transition-colors group-hover:text-[#5fe7ff]">{course.title}</h3>
        <p className="mt-1.5 line-clamp-3 text-sm text-white/74">{course.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-white/56">
          <span className="truncate pr-3">{course.createdByName}</span>
          <span className="rounded-full border border-white/14 bg-white/8 px-3 py-1 text-white/78">{course.enrolledCount} explorers</span>
        </div>
      </div>
    </Link>
  )
}

function emojiForCourse(title = '') {
  const normalized = title.toLowerCase()
  if (normalized.includes('david')) return '🪨'
  if (normalized.includes('noah')) return '🌈'
  if (normalized.includes('jonah')) return '🐋'
  return '⭐'
}
