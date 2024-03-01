import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

function getErrorMessage(err: any) {
  if (err.response) {
    if (err.response.data) {
      return err.response.data.message
    } else {
      return 'Agent service error'
    }
  } else if (err.request) {
    return 'Your server seems to be offline now.'
  }
  return 'Unknown'
}

export async function diskClean(address: string) {
  try {
    const response = await axios.get(`http://${address}:21000/disk/clean`)
    return response
  } catch (err: any) {
    return {
      success: false,
      message: getErrorMessage(err),
    }
  }
}

export async function createDatabase(
  address: string,
  data: { name: string; encoding: string }
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(`http://${address}:21000/database`, data)
    console.log('createDatabase', res.data)
    return res.data
  } catch (err: any) {
    console.log(err)
    return { error: -1 }
  }
}

export async function deleteDatabase(address: string, name: string) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.delete(`http://${address}:21000/database/${name}`)
    console.log('deleteDatabase', res.data)
    return res.data
  } catch (err: any) {
    return { error: -1 }
  }
}

export async function createDatabaseUser(
  address: string,
  data: { name: string; password: string }
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(`http://${address}:21000/database/user`, data)
    console.log('createDatabaseUser', res.data)
    return res.data
  } catch (err: any) {
    return { error: -1 }
  }
}

export async function deleteDatabaseUser(address: string, name: string) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.delete(
      `http://${address}:21000/database/user/${name}`
    )
    console.log('deleteDatabaseUser', res.data)
    return res.data
  } catch (err: any) {
    return { error: -1 }
  }
}

export async function grantDatabaseUser(
  address: string,
  database: string,
  userName: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(
      `http://${address}:21000/database/grant/assign`,
      {
        database,
        userName,
      }
    )
    console.log('grantDatabaseUser', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function removeDatabaseUserGrant(
  address: string,
  database: string,
  userName: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(
      `http://${address}:21000/database/grant/remove`,
      {
        database,
        userName,
      }
    )
    console.log('removeDatabaseUserGrant', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function createWebApplication(address: string, payload: any) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(
      `http://${address}:21000/webapps/custom`,
      payload
    )
    console.log('createWebApplication', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function createWordpress(address: string, payload: any) {
  try {
    console.log('agent->payload:', payload)
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(
      `http://${address}:21000/webapps/wordpress`,
      payload
    )
    console.log('createWebApplication', res.data)
    return res.data
  } catch (e: any) {
    console.log('createWordpress', e)
    if (e.response) {
      console.log(e.response.data)
      return { error: -1, message: e.response.data }
    }
    return { error: -1, message: e.message }
  }
}

export async function createPhpMyAdmin(address: string, payload: any) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(
      `http://${address}:21000/webapps/phpmyadmin`,
      payload
    )
    console.log('createWebApplication', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function updateWebApplication() {
  return null
}

export async function setDefaultApp() {
  return null
}

export async function removeDefaultApp() {
  return null
}

export async function deleteWebApplication(address: string, name: string) {
  return null
}

export async function createSystemUser(
  address: string,
  { name, password }: { name: string; password: string }
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const response = await axios.post(`http://${address}:21000/system/user`, {
      name,
      password,
    })
    console.log('createSystemUser', response.data)
    return response.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function deleteSystemUser(address: string, name: string) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const response = await axios.delete(
      `http://${address}:21000/system/user/${name}`
    )
    console.log('deleteSystemUser', response.data)
    return response.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function changeSystemUserPassword(
  address: string,
  name: string,
  password: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.put(
      `http://${address}:21000/system/user/${name}/changepwd`,
      {
        password,
      }
    )
    console.log('changeSystemUserPassword', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function createSSHKey(
  address: string,
  userName: string,
  pubKey: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(`http://${address}:21000/sshkey`, {
      userName,
      pubKey,
    })
    console.log('createSSHKey', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function deleteSSHKey(
  address: string,
  usreName: string,
  pubKey: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(`http://${address}:21000/sshkey/delete`, {
      usreName,
      pubKey,
    })
    console.log('deleteSSHKey', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function createDeploymentKey(address: string, userName: string) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return {
        error: 0,
        publicKey: `TEST_PUBLIC_KEY_${uuidv4()}${uuidv4()}${uuidv4()}`,
      }
    }
    const res = await axios.post(`http://${address}:21000/deploymentkey`, {
      userName,
    })
    console.log('createDeploymentKey', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function deleteDeploymentKey(address: string, name: string) {
  try {
    const response = await axios.post(
      `http://${address}:21000/deploymentkey/delete`,
      { name: name }
    )
    return response
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function createCronJob(address: string, data: any) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(`http://${address}:21000/cronjob`, data)
    console.log('createCronJob', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function removeCronJob(address: string, label: string) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.delete(`http://${address}:21000/cronjob/${label}`)
    console.log('removeCronJob', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function createSupervisorJob(address: string, data: any) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(`http://${address}:21000/supervisor`, data)
    console.log('createSupervisorJob', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function deleteSupervisorJob(address: string, name: string) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.delete(`http://${address}:21000/supervisor/${name}`)
    console.log('deleteSupervisorJob', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function rebuildCronJob() {
  return null
}

export async function createGitRepository(
  address: string,
  payload: { url: string; branch: string }
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(
      `http://${address}:21000/webapp/deploy`,
      payload
    )
    console.log('createGitRepository', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function getFileList(
  address: string,
  webapp: string,
  folder: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.get(
      `http://${address}:21000/webapp/${webapp}/filemanager/list/${folder}`
    )
    console.log('getFileList', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function createFile(
  address: string,
  webapp: string,
  fileName: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.get(
      `http://${address}:21000/webapp/${webapp}/filemanager/create/file/${fileName}`
    )
    console.log('createFile', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function createFolder(
  address: string,
  webapp: string,
  folderName: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.get(
      `http://${address}:21000/webapp/${webapp}/filemanager/create/folder/${folderName}`
    )
    console.log('createFolder', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function changeFileName(
  address: string,
  webapp: string,
  oldname: string,
  newname: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(
      `http://${address}:21000/webapp/${webapp}/filemanager/changename`,
      {
        oldname,
        newname,
      }
    )
    console.log('changeFileName', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function changeFilePermission(
  address: string,
  webapp: string,
  permission: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(
      `http://${address}:21000/webapp/${webapp}/filemanager/change_permission`,
      {
        permission,
      }
    )
    console.log('changeFilePermission', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function createWebSSL(address: string, payload: any) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(`http://${address}:21000/webapps/ssl`, payload)
    console.log('createWebSSL', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function backupDatabase(database: string) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    return { error: 0 }
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function backupWebApp(webapp: string) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    return { error: 0 }
  } catch (err: any) {
    console.log(err)
    return { error: -1 }
  }
}
