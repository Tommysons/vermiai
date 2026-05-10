'use client'

import dynamic from 'next/dynamic'

const VermiAIDashboard = dynamic(
  () => import('@/components/vermi/VermiAIDashboard'),
  {
    ssr: false,
  },
)

export default function DashboardPage() {
  return <VermiAIDashboard />
}
