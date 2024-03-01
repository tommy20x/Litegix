import { model } from 'mongoose'
import moment from 'moment'
import { User, Server, ServerActivity, UserActivity } from 'models'
const ServerActivityModel = model<ServerActivity>('ServerActivity')
const UserActivityModel = model<UserActivity>('UserActivity')

export async function createServerActivityLogInfo(
  server: Server,
  message: string,
  level: number = 1
) {
  try {
    const activity = new ServerActivityModel({
      server: server,
      category: 1,
      level: 1,
      message: message,
      date: moment(),
    })
    await activity.save()
  } catch (error) {
    return { errors: error }
  }
}

export async function createUserActivityLogInfo(
  user: User,
  message: string,
  level: number = 1
) {
  try {
    const activity = new UserActivityModel({
      user: user,
      category: 1,
      level: 1,
      message: message,
      date: moment(),
    })
    await activity.save()
  } catch (error) {
    return { errors: error }
  }
}

export async function getServerActivityLogs(server: Server) {
  const activities = await ServerActivityModel.find({ server }).sort({
    date: -1,
  })
  return {
    success: true,
    data: { activities },
  }
}

export async function getAccountActivityLogs(userId: string) {
  const user: any = userId
  const activities = await UserActivityModel.find({ user }).sort({ date: -1 })
  return {
    success: true,
    data: { activities },
  }
}
