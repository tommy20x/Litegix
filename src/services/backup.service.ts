import { model } from 'mongoose'
import { Database } from 'models'
import * as agentSvc from 'services/agent.service'
const DatabaseModel = model<Database>('Database')

export async function backup(data: any) {
  const databaseId = data.backupableDb;
  if (databaseId) {
    const database = await DatabaseModel.findById(databaseId)
    if (!database) {
      throw Error("database doesn't exists")
    }

    const r = await agentSvc.backupDatabase(database.name)
    if (r.error != 0) {
      throw new Error(`backup database agent error ${r.error}`)
    }
  }

  const webapp = data.backupableWebapp;
  if (webapp) {
    const r = await agentSvc.backupWebApp(webapp)
    if (r.error != 0) {
      throw new Error(`backup webapp agent error ${r.error}`)
    }
  }

  return {
    success: true,
  }
}
