'use client'

import { clsx } from 'clsx'
import Link from 'next/link'
import { ChevronLeftIcon, PlusIcon, TrashIcon } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { ChangeEvent, useCallback, useState } from 'react'

import Publish from './Publish'
import { useRouter } from 'next/navigation'

interface Props {
  loading?: boolean
  post?: {
    id: string
    title: string
    description: string
    content: string
    imageUrl: string | null
  }
}

export default function PostForm({ post, loading }: Props) {
  const router = useRouter()
  const [formLoading, setLoading] = useState(loading ?? false)
  const [imgData, setImgData] = useState<string | null>(post?.imageUrl ?? null)
  const [featureImage, setFeatureImage] = useState<File | null>(null)
  const [title, setTitle] = useState(post?.title ?? '')
  const [description, setDescription] = useState(post?.description ?? '')
  const [content, setContent] = useState(post?.content ?? '')

  const clearPicture = () => {
    setImgData(null)
    setFeatureImage(null)
  }
  const onChangePicture = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files && event.currentTarget.files[0]
    if (!file) return

    if (file.size / 1024 / 1024 > 50) {
      alert('Maximum file size is 50MB.')
    } else {
      setFeatureImage(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImgData(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [setImgData])

  async function publishPost() {
    const body = new FormData()
    if (featureImage) {
      body.append('image', featureImage)
    }
    body.append('title', title)
    body.append('description', description)
    body.append('content', content)
    body.append('published_at', new Date().toISOString())

    setLoading(true)
    const url = post ? '/api/posts/' + post.id : '/api/posts'
    const method = post ? 'PUT' : 'POST'
    await fetch(url, { method, body })
    setLoading(false)

    return router.push('/admin/posts')
  }

  async function saveAsDraft() {
    const body = new FormData()
    if (featureImage) body.append('image', featureImage)
    body.append('title', title)
    body.append('description', description)
    body.append('content', content)

    setLoading(true)
    const url = post ? '/api/posts/' + post.id : '/api/posts'
    const method = post ? 'PUT' : 'POST'
    await fetch(url, { method, body })
    setLoading(false)

    return router.push('/admin/posts')
  }

  function schedulePublish() {
    alert('Under construction')
  }

  function clearAll() {
    setTitle('')
    setDescription('')
    setContent('')
    clearPicture()
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto pb-60">
      <div
        className={clsx('bg-white opacity-50 w-full h-full top-0 left-0 z-50', formLoading ? 'absolute' : 'hidden')}></div>
      <div className="flex items-center justify-between mb-4">
        <div className="-ml-4 py-3">
          <Link href="/admin/posts"
                className="inline-flex text-sm gap-4 items-center text-gray-800 font-medium hover:underline">
            <ChevronLeftIcon size={16}/>
            <span>Back to posts</span>
          </Link>
        </div>
        <Publish
          isReadyToPublish={!!(title && description && content)}
          onPublish={publishPost}
          onSaveAsDraft={saveAsDraft}
          onSchedulePublish={schedulePublish}
          onClearAll={clearAll}
        />
      </div>
      <div>
        <div className="relative inline-block mb-6">
          {imgData && (
            <>
              <img src={imgData} alt="Preview" className="block rounded mb-3 h-full object-cover w-full"/>
              <button
                className="absolute block p-3 mt-4 mr-4 top-0 right-0 text-white bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full"
                onClick={clearPicture}
              >
                <TrashIcon/>
              </button>
            </>
          )}
          {!imgData && (
            <>
              <button className="text-sm text-gray-700 border border-gray-300 p-2.5 flex items-center gap-3 rounded">
                <PlusIcon size={20}/>
                <span>Add feature image</span>
              </button>
              <input
                type="file"
                className="cursor-pointer absolute block h-10 opacity-0 top-0 left-0"
                accept="image/*"
                onChange={onChangePicture}
              />
            </>
          )}
        </div>
        <div className="w-full mb-4">
          <label htmlFor="title" className="sr-only">Title</label>
          <TextareaAutosize
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-gray-900 text-6xl font-medium block focus:outline-0 resize-none leading-tighter tracking-tight"
          />
        </div>
        <div className="w-full mb-4">
          <label htmlFor="title" className="sr-only">Title</label>
          <TextareaAutosize
            placeholder="Write a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-gray-800 text-lg font-medium block focus:outline-0 resize-none"
          />
        </div>
        <div className="w-full">
          <label htmlFor="content" className="sr-only">Content</label>
          <TextareaAutosize
            placeholder="Begin writing your post..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-gray-900 block focus:outline-0 resize-none"
          />
        </div>
      </div>
    </div>
  )
}