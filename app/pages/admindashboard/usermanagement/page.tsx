// src/app/pages/admindashboard/usermanagement/page.tsx
import { redirect } from 'next/navigation'

export default function UserManagementIndex() {
    redirect('/pages/admindashboard/usermanagement/all-users')
}