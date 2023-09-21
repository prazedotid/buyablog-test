interface Props {
  status: 'draft' | 'scheduled' | 'published' | 'archived' | string
}

export default function PostStatus({ status }: Props) {
  return <span className="text-[11px] text-blue-700 font-bold px-4 py-1 bg-blue-100 rounded-full tracking-wider uppercase">{status}</span>
}