import 'server-only'

import fs from 'node:fs'
import path from 'node:path'
import mongoose from 'mongoose'

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined
}

const cache: MongooseCache = global.mongooseCache || { conn: null, promise: null }
let envLoaded = false

function loadLocalEnvFallback() {
  try {
    const envPath = path.join(process.cwd(), '.env')
    if (!fs.existsSync(envPath)) {
      return
    }

    const content = fs.readFileSync(envPath, 'utf8')
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) {
        return
      }

      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex <= 0) {
        return
      }

      const key = trimmed.slice(0, separatorIndex).trim()
      const value = trimmed.slice(separatorIndex + 1).trim()
      if (key && process.env[key] === undefined) {
        process.env[key] = value
      }
    })
  } catch {
    // Intentionally ignore; the regular process.env path is still used.
  }
}

if (!global.mongooseCache) {
  global.mongooseCache = cache
}

export async function connectToDatabase() {
  let mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL ||
    process.env.NEXT_PUBLIC_MONGODB_URI

  if (!mongoUri && !envLoaded) {
    loadLocalEnvFallback()
    envLoaded = true
    mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGODB_URL ||
      process.env.NEXT_PUBLIC_MONGODB_URI
  }

  if (!mongoUri) {
    // Local development fallback to avoid blocking when env injection is flaky.
    mongoUri = 'mongodb://127.0.0.1:27017'
  }

  if (cache.conn) {
    return cache.conn
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB || 'krishna_store',
    })
  }

  cache.conn = await cache.promise
  return cache.conn
}
