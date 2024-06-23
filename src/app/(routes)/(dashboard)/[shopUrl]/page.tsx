import { Metadata } from 'next'
import { Overview } from '@/components/Overview/Overview'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard for managing your store',
}

export default function Home({ params }: { params: { shopUrl: string }} ) {
  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-start-1 col-end-5">
        <h3 className="text-sm font-semibold">Overview</h3>
      </div>
      <Overview shopUrl={params.shopUrl} />
    </div>
  )
}
