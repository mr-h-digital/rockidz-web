import { Link } from 'react-router-dom'
import { resolveApiUrl } from '../api/client'

const davidCoverUrl = `${import.meta.env.BASE_URL}david-and-goliath-program-cover-image.webp`

export default function CourseCard({ course }) {
  const useProvidedArtwork = course.slug === 'david-and-goliath'

  return (
    <Link
      to={`/activities/${course.slug}`}
      className="group block overflow-hidden rounded-[1.75rem] border-4 border-white/75 bg-white/80 shadow-[0_16px_34px_rgba(125,60,255,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(125,60,255,0.22)]"
    >
      <div className="relative flex aspect-[16/11] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#56dfff_0%,#b35cff_38%,#ff6ab3_70%,#ffe45c_100%)]">
        <div className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#4f1f8f] shadow-[0_10px_18px_rgba(79,31,143,0.12)]">
          Bible fun
        </div>
        {course.thumbnailUrl ? (
          <img src={resolveApiUrl(course.thumbnailUrl)} alt="" className="relative z-[1] h-full w-full object-cover" />
        ) : useProvidedArtwork ? (
          <img src={davidCoverUrl} alt="" className="relative z-[1] h-full w-full object-cover" />
        ) : (
          <span className="relative z-[1] text-6xl">{emojiForCourse(course.title)}</span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-2xl text-[#4f1f8f] transition-colors group-hover:text-[#00b8ff]">{course.title}</h3>
        <p className="mt-1.5 line-clamp-3 text-sm text-[#5d487f]">{course.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-[#8a71b5]">
          <span>{course.createdByName}</span>
          <span>{course.enrolledCount} kids joined</span>
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
