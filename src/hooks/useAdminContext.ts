import { AdminContext } from "@/context/adminContext";
import { useContext } from "react";

export function useAdminContext () {
  const context = useContext(AdminContext)

  if(!context){
    throw new Error("useAdmin must be used within an AdminProvider")
  }

  return context
}