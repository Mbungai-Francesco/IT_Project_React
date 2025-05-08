import type { Admin } from "@/types"

const defaultAdmin: Admin = { id: 0, name : '', email : '', password: '' }

export const getAdmin = () => {
  const admin = localStorage.getItem('admin')
  if (admin) {
    return JSON.parse(admin) as Admin
  } else {
    localStorage.setItem('admin', JSON.stringify(defaultAdmin))
    return defaultAdmin
  }
}

export const setStoreAdmin = (admin: Admin, setAd : React.Dispatch<React.SetStateAction<Admin>>) => {
  localStorage.setItem('admin', JSON.stringify(admin))
  setAd(admin)
}
