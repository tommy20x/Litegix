import randomstring from 'randomstring'
import { model } from 'mongoose'
import { User, IPAddress } from 'models'
import * as activity from 'services/activity.service'
const UserModel = model<User>('User')
const IPAddressModel = model<IPAddress>('IPAddress')

const generateApiKey = function () {
  return randomstring.generate(44)
}

const generateApiSecret = function () {
  return randomstring.generate(64)
}

export async function getApiKeys(userId: string) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('InvalidUser')
  }

  user.apiKeys = user.apiKeys || {}
  if (!user.apiKeys.apiKey || !user.apiKeys.secretKey) {
    user.apiKeys.enableAccess = false
    user.apiKeys.apiKey = generateApiKey()
    user.apiKeys.secretKey = generateApiSecret()
    await user.save()
  }

  return {
    success: true,
    data: { apiKeys: user.apiKeys },
  }
}

export async function createApiKey(userId: string) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('InvalidUser')
  }

  user.apiKeys = user.apiKeys || {}
  user.apiKeys.apiKey = generateApiKey()
  await user.save()

  return {
    success: true,
    data: {
      apiKeys: user.apiKeys,
    },
  }
}

export async function createSecretKey(userId: string) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('InvalidUser')
  }

  user.apiKeys = user.apiKeys || {}
  user.apiKeys.secretKey = generateApiSecret()
  await user.save()

  return {
    success: true,
    data: {
      apiKeys: user.apiKeys,
    },
  }
}

export async function enableAccess(userId: string, data: any) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('InvalidUser')
  }

  user.apiKeys = user.apiKeys || {}
  user.apiKeys.enableAccess = data.state
  await user.save()

  const message =
    data.state === true ? 'Enable API Access' : 'Disable API Access'
  await activity.createUserActivityLogInfo(user.id, message)

  return {
    success: true,
    data: { enableAccess: data.state },
  }
}

export async function getAllowedIPAddresses(userId: string) {
  const user: any = userId
  const addresses = await IPAddressModel.find({ user })
  return {
    success: true,
    data: { addresses },
  }
}

export async function addAllowedIPAddress(userId: string, data: any) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('InvalidUser')
  }

  const addr = new IPAddressModel(data)
  addr.user = user

  const saved = await addr.save()
  if (!saved) {
    throw Error('DBSaveError')
  }

  return {
    success: true,
    data: { address: data.address },
  }
}
