import { model } from 'mongoose'
import { User, Channel } from 'models'
import { createUserActivityLogInfo } from 'services/activity.service'
const UserModel = model<User>('User')
const ChannelModel = model<Channel>('Channel')

export async function getNotifications(userId: string) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('InvalidUser')
  }

  return {
    success: true,
    data: {
      newsletters: user.newsletters,
    },
  }
}

export async function subscribe(
  userId: string,
  {
    subscription,
    announchment,
    blog,
    events,
  }: {
    subscription: boolean
    announchment: boolean
    blog: boolean
    events: boolean
  }
) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('InvalidUser')
  }

  user.newsletters = {
    subscription: subscription,
    announchment: announchment,
    blog: blog,
    events: events,
  }
  if (!(await user.save())) {
    throw Error('DBSaveError')
  }

  const message = `Subscribe to newsletter`
  await createUserActivityLogInfo(user, message)

  return {
    success: true,
    data: {},
  }
}

export async function unsubscribe(userId: string) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('InvalidUser')
  }
  if (user.newsletters) {
    user.newsletters.subscription = false
  }
  if (!(await user.save())) {
    throw Error('DBSaveError')
  }

  const message = `Unsubscribe from newsletter`
  await createUserActivityLogInfo(user, message, 2)

  return {
    success: true,
    data: {},
  }
}

export async function getChannels(userId: any) {
  console.log('getChannels', userId)
  const user: any = userId
  const channels = await ChannelModel.find({ user })

  return {
    success: true,
    data: {
      channels: channels,
    },
  }
}

export async function storeChannel(
  userId: string,
  { service, name, address }: { service: string; name: string; address: string }
) {
  if (service == 'Email' || service == 'Slack') {
    if (!address) {
      throw Error('Invalid address')
    }
  }

  const user: any = userId
  let condition: any = {
    user,
    service,
    name,
  }
  if (address) {
    condition = { ...condition, address }
  }
  console.log('address', condition)

  const exists = await ChannelModel.findOne(condition)
  if (exists) {
    throw Error('Already exists')
  }

  const channel = new ChannelModel({
    user,
    service,
    name,
    address,
  })
  await channel.save()

  const message = `Added Notification Channel ${name} (${service})`
  await createUserActivityLogInfo(channel.user, message, 2)

  return {
    success: true,
    data: { id: channel.id },
  }
}

export async function updateChannel(
  channel: Channel,
  { service, name, address }: { service: string; name: string; address: string }
) {
  if (service == 'Email' || service == 'Slack') {
    if (!address) {
      throw Error('Invalid address')
    }
  }

  if (channel.service != service) {
    throw Error('InvalidService')
  }

  channel.service = service
  channel.name = name
  channel.address = address
  await channel.save()

  const message = `Update Notification Channel ${name} (${service})`
  await createUserActivityLogInfo(channel.user, message, 2)

  return {
    success: true,
    data: { channel },
  }
}

export async function deleteChannel(channel: Channel) {
  await channel.remove()

  const message = `Delete Notification Channel ${channel.name} (${channel.service})`
  await createUserActivityLogInfo(channel.user, message, 2)

  return {
    success: true,
    data: { id: channel.id },
  }
}

export async function channelHealthSetting(channel: Channel, data: any) {
  /*if (data.load) {
    channel.load = data.load
  }
  if (data.memory) {
    channel.memory = data.memory
  }
  if (data.load || data.memory) {
    channel.save()

    const message =
      `Update Server Health Notification Setting for Channel ${channel.name} (${channel.service}) : ` +
      ` Load=${channel.load},  Memory=${channel.memory}.`
    await createUserActivityLogInfo(channel.user, message, 2)
  }

  return {
    success: true,
    data: {
      load: channel.load,
      memory: channel.memory,
    },
  }*/
}
