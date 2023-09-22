import { v4 as uuid } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import {
  CompleteMultipartUploadCommandOutput
} from '@aws-sdk/client-s3/dist-types/commands/CompleteMultipartUploadCommand'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.AWS_REGION as string,
})

export const uploadFile = async ({ file, bucketName }: { file: File, bucketName: string }): Promise<CompleteMultipartUploadCommandOutput> => {
  const key = uuid()
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: bucketName,
      Body: file.stream(),
      ContentType: file.type,
      Key: key,
    },
  })

  return upload.done()
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentUser()
  if (!session) {
    return NextResponse.json('Unauthorized.', { status: 401 })
  }

  const post = await prisma.posts.findUnique({
    where: { id: params.id },
  })
  if (!post) {
    return NextResponse.json('Not found.', { status: 404 })
  }

  const formData = await req.formData()
  let imageUrl: string | null = ''

  if (formData.has('image')) {
    const img = formData.get('image')
    if (img === null) {
      imageUrl = img
    } else {
      const uploadToS3 = await uploadFile({
        file: formData.get('image') as File,
        bucketName: 'buyablog-post-images',
      })
      imageUrl = uploadToS3.Location as string
    }
  }

  await prisma.posts.update({
    where: { id: params.id },
    data: {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      publishedAt: formData.get('published_at') as string,
      imageUrl,
      categoryId: formData.get('category_id') as string,
      updatedAt: new Date(),
    },
  })

  return NextResponse.json({ success: true }, { status: 200 })
}