import { PencilIcon, TrashIcon } from 'lucide-react'
import { noop } from '@/lib/util'

interface Props {
  id: string
  onUpdateClick: (id: string) => void
  onDeleteClick: (id: string) => void
}

export default function ActionCell({ id, onUpdateClick = noop, onDeleteClick = noop }: Props) {
  return (
    <div id={id} className="-my-1 flex items-center gap-1">
      <button onClick={() => onUpdateClick(id)} className="p-2 rounded-full hover:bg-blue-100">
        <PencilIcon className="text-blue-500" size={20} />
      </button>
      <button onClick={() => onDeleteClick(id)} className="p-2 rounded-full hover:bg-red-100">
        <TrashIcon className="text-red-500" size={20} />
      </button>
    </div>
  )
}