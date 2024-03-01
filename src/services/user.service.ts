import { model } from 'mongoose'
import { User } from 'models'
import { countries, timezones } from './constants'
const UserModel = model<User>('User')

export async function getUsers(page: number, size: number) {
  page = Math.max(1, isNaN(page) ? 1 : page)
  size = Math.min(100, isNaN(size) ? 10 : size)

  const users = await UserModel.find({ deleted: false })
    .skip((page - 1) * size)
    .limit(size)

  const total = await UserModel.find({ deleted: false }).count()

  return {
    success: true,
    data: {
      total,
      page,
      size,
      users,
    },
  }
}

export async function getUserInfo(userId: string) {
  const user = await UserModel.findById(userId).populate('company')
  if (!user) {
    throw Error("User doesn't exists")
  }

  return {
    success: true,
    data: { user },
  }
}

export async function newUser() {
  return {
    success: true,
    data: {
      countries: countries,
      timezones: timezones,
    },
  }
}

export async function createUser({
  email,
  username,
  password,
}: {
  email: string
  username: string
  password: string
}) {
  const exists = await UserModel.findOne({ email })
  if (exists) {
    throw Error('Email is already token')
  }

  const user = new UserModel({
    username,
    email,
  })
  user.setPassword(password)

  const created = await user.save()

  return {
    success: true,
    data: { user: created },
  }
}

export async function updateUser(userId: string, data: any) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('User does not exist')
  }

  user.email = data.email
  user.username = data.username
  user.setPassword(data.password)

  await user.save()

  return {
    success: true,
    data: { user },
  }
}

export async function deleteUser(userId: string) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error("User doesn't exists")
  }

  user.deleted = true
  await user.save()

  return {
    success: true,
    data: { id: user.id },
  }
}
