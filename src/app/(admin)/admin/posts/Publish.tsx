import { Menu, Transition } from '@headlessui/react'
import { clsx } from 'clsx'
import { ChevronDownIcon } from 'lucide-react'
import { Fragment } from 'react'

interface Props {
  onPublish: () => void
  onSaveAsDraft: () => void
  onSchedulePublish: () => void
  onClearAll: () => void
  isReadyToPublish: boolean
  canSaveToDraft: boolean
}

export default function Publish({ onClearAll, onSaveAsDraft, onSchedulePublish, onPublish, isReadyToPublish, canSaveToDraft }: Props) {
  const publishButtonCls = clsx('px-5 py-3 text-sm bg-blue-100 rounded-bl rounded-tl text-blue-800 font-medium', !isReadyToPublish ? 'opacity-50' : 'hover:bg-blue-200')
  const scheduleButtonCls = clsx(`group flex w-full items-center rounded-md px-2 py-2 text-sm`, !isReadyToPublish && 'opacity-50')
  const saveToDraftButtonCls = clsx(`group flex w-full items-center rounded-md px-2 py-2 text-sm`, !canSaveToDraft && 'opacity-50')

  return (
    <div className="flex items-center">
      <button
        onClick={onPublish}
        disabled={!isReadyToPublish}
        className={publishButtonCls}
      >
        Publish
      </button>
      <Menu as="div" className="relative inline-block">
        <Menu.Button
          className="px-3 py-4 text-sm bg-blue-100 rounded-br rounded-tr hover:bg-blue-200 text-blue-800 border-l border-blue-200 font-medium"
        >
          <ChevronDownIcon size={12}/>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={clsx(active && canSaveToDraft ? 'bg-gray-100' : 'text-gray-900', saveToDraftButtonCls)}
                    disabled={!canSaveToDraft}
                    onClick={onSaveAsDraft}
                  >
                    Save as draft
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={clsx(active && isReadyToPublish ? 'bg-gray-100' : 'text-gray-900', scheduleButtonCls)}
                    disabled={!isReadyToPublish}
                    onClick={onSchedulePublish}
                  >
                    Schedule for later
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={onClearAll}
                  >
                    Clear all
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}