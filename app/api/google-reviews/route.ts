import { NextResponse } from 'next/server'

type GoogleReview = {
  author_name: string
  profile_photo_url?: string
  rating?: number
  relative_time_description?: string
  text: string
}

type GooglePlaceDetailsResponse = {
  status?: string
  error_message?: string
  result?: {
    reviews?: GoogleReview[]
  }
}

async function fetchGoogleReviews(placeId: string, apiKey: string): Promise<{ reviews: GoogleReview[]; status?: string; errorMessage?: string }> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('place_id', placeId)
  url.searchParams.set('fields', 'reviews')
  url.searchParams.set('key', apiKey)

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  })

  const data = (await res.json()) as GooglePlaceDetailsResponse
  if (!res.ok || data.status !== 'OK') {
    return {
      reviews: [],
      status: data.status ?? `HTTP_${res.status}`,
      errorMessage: data.error_message ?? 'Google Places request failed',
    }
  }

  const reviews = data.result?.reviews ?? []

  return {
    reviews: reviews.filter((review) => Boolean(review.text)).slice(0, 12),
    status: data.status,
  }
}

export async function GET() {
  const placeId = process.env.GOOGLE_PLACE_ID
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!placeId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing GOOGLE_MAPS_API_KEY or GOOGLE_PLACE_ID' },
      { status: 500 }
    )
  }

  try {
    const { reviews, status, errorMessage } = await fetchGoogleReviews(placeId, apiKey)

    if (reviews.length === 0) {
      return NextResponse.json(
        {
          error: errorMessage ?? 'No Google reviews found for the provided place ID',
          status: status ?? 'NO_REVIEWS',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ reviews, source: 'google' as const }, { status: 200 })
  } catch (error) {
    console.error('[google-reviews] Failed fetching Google reviews', error)

    return NextResponse.json(
      { error: 'Failed to fetch Google reviews', status: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}
