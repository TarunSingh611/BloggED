import { prisma } from '../prisma'

function startOfUTCDate(d: Date): Date {
  const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0))
  return dt
}

export async function recordView(contentId: string, userId?: string | null) {
  const date = startOfUTCDate(new Date())
  await prisma.analyticsDaily.upsert({
    where: { contentId_date: { contentId, date } as any },
    create: { contentId, date, views: 1, uniqueUsers: userId ? 1 : 0 },
    update: {
      views: { increment: 1 },
      ...(userId ? { uniqueUsers: { increment: 1 } } : {}),
    },
  })
}

export async function recordVote(contentId: string, type: 'UPVOTE' | 'DOWNVOTE' | 'FAVORITE' | 'BOOKMARK', delta: 1 | -1) {
  const date = startOfUTCDate(new Date())
  await prisma.analyticsDaily.upsert({
    where: { contentId_date: { contentId, date } as any },
    create: {
      contentId, date,
      upvotes: type === 'UPVOTE' ? 1 : 0,
      downvotes: type === 'DOWNVOTE' ? 1 : 0,
      favorites: type === 'FAVORITE' ? 1 : 0,
      bookmarks: type === 'BOOKMARK' ? 1 : 0,
    },
    update: {
      ...(type === 'UPVOTE' ? { upvotes: { increment: delta } } : {}),
      ...(type === 'DOWNVOTE' ? { downvotes: { increment: delta } } : {}),
      ...(type === 'FAVORITE' ? { favorites: { increment: delta } } : {}),
      ...(type === 'BOOKMARK' ? { bookmarks: { increment: delta } } : {}),
    },
  })
}

export async function recordTimeOnPageSample(contentId: string, timeMs: number) {
  const date = startOfUTCDate(new Date())
  // naive running stats; track total sum and count; p50/p90 reserved for future
  await prisma.analyticsDaily.update({
    where: { contentId_date: { contentId, date } as any },
    data: { avgTimeMs: { increment: timeMs }, timeSamples: { increment: 1 } },
  }).catch(async () => {
    await prisma.analyticsDaily.create({ data: { contentId, date, avgTimeMs: timeMs, timeSamples: 1 } })
  })
}

export async function attachTagsSnapshot(contentId: string, tags: string[]) {
  const date = startOfUTCDate(new Date())
  await prisma.analyticsDaily.upsert({
    where: { contentId_date: { contentId, date } as any },
    create: { contentId, date, tags },
    update: { tags },
  })
}

export async function recordNextContent(contentId: string, nextContentId: string) {
  const date = startOfUTCDate(new Date())
  const row = await prisma.analyticsDaily.findUnique({ where: { contentId_date: { contentId, date } as any } })
  const arr = row?.recentNextContentIds || []
  // keep capped to last 25 to bound size
  const updated = [...arr, nextContentId].slice(-25)
  await prisma.analyticsDaily.upsert({
    where: { contentId_date: { contentId, date } as any },
    create: { contentId, date, recentNextContentIds: updated },
    update: { recentNextContentIds: updated },
  })
}


