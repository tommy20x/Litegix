export default process.env.NODE_ENV === 'producton'
  ? String(process.env.SECRET)
  : 'litegix.easy-server-management-2021'
