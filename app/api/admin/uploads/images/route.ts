import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isCurrentUserAdmin } from '@/lib/server/admin-auth'

export const runtime = 'nodejs'

type SignedCloudinaryConfig = {
  mode: 'signed'
  cloudName: string
  apiKey: string
  apiSecret: string
  folder: string
}

type UnsignedCloudinaryConfig = {
  mode: 'unsigned'
  cloudName: string
  uploadPreset: string
}

type MissingCloudinaryConfig = {
  mode: 'missing'
  missing: string[]
}

type CloudinaryConfig = SignedCloudinaryConfig | UnsignedCloudinaryConfig | MissingCloudinaryConfig

function getCloudinaryConfig(): CloudinaryConfig {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'products'

  if (cloudName && uploadPreset) {
    return {
      mode: 'unsigned',
      cloudName,
      uploadPreset,
    }
  }

  if (cloudName && apiKey && apiSecret) {
    return {
      mode: 'signed',
      cloudName,
      apiKey,
      apiSecret,
      folder,
    }
  }

  const missing: string[] = []

  if (!cloudName) {
    missing.push('CLOUDINARY_CLOUD_NAME')
  }

  if (!uploadPreset && (!apiKey || !apiSecret)) {
    if (!uploadPreset) {
      missing.push('CLOUDINARY_UPLOAD_PRESET (or provide API key/secret)')
    }
    if (!apiKey) {
      missing.push('CLOUDINARY_API_KEY')
    }
    if (!apiSecret) {
      missing.push('CLOUDINARY_API_SECRET')
    }
  }

  return {
    mode: 'missing',
    missing,
  }
}

function buildSignature(folder: string, timestamp: number, apiSecret: string) {
  const payload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  return createHash('sha1').update(payload).digest('hex')
}

async function uploadSingleImage(file: File, config: SignedCloudinaryConfig | UnsignedCloudinaryConfig) {
  const uploadPayload = new FormData()
  uploadPayload.append('file', file)

  if (config.mode === 'signed') {
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = buildSignature(config.folder, timestamp, config.apiSecret)

    uploadPayload.append('api_key', config.apiKey)
    uploadPayload.append('timestamp', String(timestamp))
    uploadPayload.append('folder', config.folder)
    uploadPayload.append('signature', signature)
  } else {
    uploadPayload.append('upload_preset', config.uploadPreset)
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: 'POST',
    body: uploadPayload,
  })

  if (!response.ok) {
    const cloudinaryError = await response.text()
    throw new Error(`Cloudinary upload failed: ${cloudinaryError}`)
  }

  const data = (await response.json()) as { secure_url?: string }

  if (!data.secure_url) {
    throw new Error('Cloudinary did not return secure_url')
  }

  return data.secure_url
}

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = await isCurrentUserAdmin()

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const config = getCloudinaryConfig()

  if (config.mode === 'missing') {
    return NextResponse.json(
      {
        error: 'Cloudinary is not configured.',
        details: config.missing,
      },
      { status: 500 }
    )
  }

  const formData = await request.formData()
  const files = formData.getAll('files').filter((item): item is File => item instanceof File)

  if (files.length === 0) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
  }

  try {
    const images = await Promise.all(files.map((file) => uploadSingleImage(file, config)))
    return NextResponse.json({ images })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
