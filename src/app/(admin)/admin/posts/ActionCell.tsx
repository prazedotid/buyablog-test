import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react'

interface Props {
  id: string
}

export default function ActionCell({ id }: Props) {
  return (
    <div id={id} className="-my-1 flex items-center gap-1">
      <button className="p-2 rounded-full hover:bg-gray-200">
        <EyeIcon className="text-gray-700" size={20} />
      </button>
      <button className="p-2 rounded-full hover:bg-blue-100">
        <PencilIcon className="text-blue-500" size={20} />
      </button>
      <button className="p-2 rounded-full hover:bg-red-100">
        <TrashIcon className="text-red-500" size={20} />
      </button>
    </div>
  )
}