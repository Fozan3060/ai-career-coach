import React, { Children, ReactNode } from 'react'
import { SidebarInset } from '../ui/sidebar'

interface MainbarType {
  children: ReactNode
}

const Mainbar: React.FC<MainbarType> = ({ children }) => {
  return <SidebarInset >{children}</SidebarInset>
}

export default Mainbar
