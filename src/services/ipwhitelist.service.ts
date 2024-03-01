import { model } from 'mongoose'
import { User, IPAddress } from 'models'
const UserModel = model<User>('User')
const IPAddressModel = model<IPAddress>('IPAddress')

export async function getWhiteList(userId: string) {
  const user: any = userId
  const whitelist = await IPAddressModel.find({ user })

  return {
    success: true,
    data: { whitelist },
  }
}

export async function storeIPAddress(userId: string, address: string) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('Invalid user')
  }

  const ipaddress = new IPAddressModel({
    address,
    user,
  })
  await ipaddress.save()

  return {
    success: true,
    data: { ipaddress },
  }
}

export async function deleteIp(userId: string, addrId: string) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('Invalid user')
  }

  const address = await IPAddressModel.findOneAndDelete({
    _id: addrId,
    user: user,
  })

  return {
    success: true,
    data: { address },
  }
}

export async function setIPWhitelistingState(
  userId: string,
  ipwhitelisting: boolean
) {
  const res = await UserModel.findByIdAndUpdate(userId, { ipwhitelisting })
  if (!res) {
    throw Error('Unable to update state')
  }

  return {
    success: true,
    data: {},
  }
}
