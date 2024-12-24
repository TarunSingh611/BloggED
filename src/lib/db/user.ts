// lib/db/user.ts
import { prisma } from '../prisma'
import type { Prisma } from '@prisma/client'

type UserWithContents = Prisma.UserGetPayload<{
  include: { contents: true }
}>

interface GetUsersOptions {
  role?: 'USER' | 'ADMIN'
  take?: number
  skip?: number
}

export async function getUsers(options?: GetUsersOptions) {
  const where: any = {}
  
  if (options?.role) {
    where.role = options.role
  }

  return prisma.user.findMany({
    where,
    take: options?.take,
    skip: options?.skip,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      contents: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function createUser(data: {
  email: string
  name?: string
  image?: string
  role?: 'USER' | 'ADMIN'
}) {
  return prisma.user.create({
    data,
  })
}

export async function updateUser(
  id: string,
  data: {
    email?: string
    name?: string
    image?: string
    role?: 'USER' | 'ADMIN'
  }
) {
  return prisma.user.update({
    where: { id },
    data,
  })
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  })
}