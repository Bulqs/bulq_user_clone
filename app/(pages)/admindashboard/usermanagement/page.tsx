// src/app/admindashboard/usermanagement/page.tsx
import { redirect } from 'next/navigation'

export default function UserManagementIndex() {
    redirect('/admindashboard/usermanagement/all-users')
}