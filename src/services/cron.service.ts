import { model } from 'mongoose'
import { Server, CronJob, Supervisor, SystemUser } from 'models'
import * as activity from 'services/activity.service'
import * as agentSvc from 'services/agent.service'
import { vendor_binaries, predefined_settings } from './constants'
const CronJobModel = model<CronJob>('CronJob')
const SupervisorModel = model<Supervisor>('Supervisor')
const SystemUserModel = model<SystemUser>('SystemUser')

export async function getCronJobs(server: Server) {
  const cronJobs = await CronJobModel.find({ server }).populate('user')
  console.log('cronJobs', cronJobs)
  return {
    success: true,
    data: {
      cronJobs: cronJobs.map((it) => {
        const job = it.toJSON()
        return { ...job, user: it.user?.name }
      }),
    },
  }
}

export async function getCronJob(jobId: string) {
  const cronjob = await CronJobModel.findById(jobId)
  return {
    success: true,
    data: { cronjob },
  }
}

export async function createCronJob(server: Server) {
  const systemUsers = await SystemUserModel.find({ server })
  return {
    success: true,
    system_users: systemUsers.map((user) => ({ id: user.id, name: user.name })),
    vendor_binaries: vendor_binaries,
    predefined_settings: predefined_settings,
  }
}

export async function storeCronJob(server: Server, data: any) {
  const exists = await CronJobModel.findOne({
    server,
    label: data.label,
  })
  if (exists) {
    throw new Error('Label has already been taken.')
  }

  const systemUser = await SystemUserModel.findById(data.user)
  if (!systemUser) {
    throw new Error('System user does not exist')
  }

  const res = await agentSvc.createCronJob(server.address, data)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  data.time = [
    data.minute,
    data.hour,
    data.dayOfMonth,
    data.month,
    data.dayOfWeek,
  ].join(' ')

  const cronJob = new CronJobModel(data)
  cronJob.server = server
  cronJob.user = systemUser
  await cronJob.save()

  const message = `Added new Cron Job ${data.label}`
  await activity.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { cronJob },
  }
}

export async function removeCronJob(server: Server, jobId: string) {
  const cronJob = await CronJobModel.findById(jobId)
  if (!cronJob) {
    throw new Error("It doesn't exists")
  }

  const res = await agentSvc.removeCronJob(server.address, cronJob.label)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  await cronJob.remove()

  return {
    success: true,
    data: { id: cronJob.id },
  }
}

// const rebuildJob = async function (req: Request, res: Response) {
//   try {
//     const cronjob = await CronJobModel.findById(req.params.jobId)
//     return res.json({
//       success: true,
//       data: { cronjob },
//     })
//   } catch (e) {
//     console.error(e)
//     return res.status(501).json({ success: false })
//   }
// }

export async function getSupervisorJobs(server: Server) {
  const supervisors = await SupervisorModel.find({ server }).populate('user')
  return {
    success: true,
    data: {
      supervisors: supervisors.map((it) => {
        const job = it.toJSON()
        return { ...job, user: it.user?.name }
      }),
    },
  }
}

export async function createSupervisorJob(server: Server) {
  const systemUsers = await SystemUserModel.find({ server })
  return {
    success: true,
    system_users: systemUsers.map((user) => ({ id: user.id, name: user.name })),
    vendor_binaries: vendor_binaries,
    predefined_settings: predefined_settings,
  }
}

export async function storeSupervisorJob(server: Server, data: any) {
  const exists = await SupervisorModel.findOne({
    server,
    name: data.name,
  })
  if (exists) {
    return {
      success: false,
      errors: { name: 'has already been taken.' },
    }
  }

  const systemUser = await SystemUserModel.findById(data.user)
  if (!systemUser) {
    throw new Error('System user does not exist')
  }

  const res = await agentSvc.createSupervisorJob(server.address, data)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  const supervisor = new SupervisorModel(data)
  supervisor.server = server
  supervisor.user = systemUser
  await supervisor.save()

  const message = `Added new Supervisor Job ${data.name}`
  await activity.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { supervisor },
  }
}

export async function deleteSupervisorJob(server: Server, jobId: string) {
  const supervisor = await SupervisorModel.findById(jobId)
  if (!supervisor) {
    throw new Error("It doesn't exists")
  }

  const res = await agentSvc.deleteSupervisorJob(
    server.address,
    supervisor.name
  )
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  await supervisor.remove()

  return {
    success: true,
    data: { supervisor },
  }
}
