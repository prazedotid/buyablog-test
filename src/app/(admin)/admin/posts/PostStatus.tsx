import clsx from 'clsx'
import { DateTime } from 'luxon'

interface Props {
  publishedAt: string | null
}

export default function PostStatus({ publishedAt }: Props) {
  let status = 'draft'
  let color = 'text-gray-700 bg-gray-100'
  if (publishedAt && DateTime.fromISO(publishedAt) > DateTime.now()) {
    status = 'scheduled'
    color = 'text-blue-700 bg-blue-100'
  } else if (publishedAt && DateTime.fromISO(publishedAt) <= DateTime.now()) {
    status = 'published'
    color = 'text-green-700 bg-green-100'
  }

  return (
    <span className={`text-[11px] ${color} font-bold px-4 py-1 rounded-full tracking-wider uppercase`}>
      {status}
    </span>
  )
}