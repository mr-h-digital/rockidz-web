import { Link } from 'react-router-dom'

const davidCoverUrl = `${import.meta.env.BASE_URL}david-and-goliath-program-cover-image.png`

export default function CourseCard({ course }) {
  const useProvidedArtwork = course.slug === 'david-and-goliath'

  return (
    <Link
      to={`/activities/${course.slug}`}
      className="group block overflow-hidden rounded-[1.75rem] border-4 border-white/70 bg-white/65 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,194,255,0.18)]"
    >
      <div className="relative flex aspect-[16/11] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#76e4ff_0%,#ffd6ea_55%,#fff1a8_100%)]">
        <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#5b2b86]">
          Bible fun
        </div>
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt="" className="relative z-[1] h-full w-full object-cover" />
        ) : useProvidedArtwork ? (
          <img src={davidCoverUrl} alt="" className="relative z-[1] h-full w-full object-cover" />
        ) : (
          <span className="relative z-[1] text-6xl">{emojiForCourse(course.title)}</span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-2xl text-[#5b2b86] transition-colors group-hover:text-[#00a8b5]">{course.title}</h3>
        <p className="mt-1.5 line-clamp-3 text-sm text-[#5b5872]">{course.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-[#8f7f9d]">
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
