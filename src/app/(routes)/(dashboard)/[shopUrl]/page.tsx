import { CounterCard } from '@/components/Widgets/CounterCard'
import { SalesChart } from '@/components/Widgets/SalesChart'
import { TrafficView } from '@/components/Widgets/TrafficView'
import { AiOutlineRise, AiOutlineFall } from 'react-icons/ai'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard for managing your store',
}

export default function Home() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-start-1 col-end-5">
        <h3 className="text-sm font-semibold">Overview</h3>
      </div>
      <CounterCard
        title="Sales"
        counter={0}
        currency="$"
        className="bg-sky-100 dark:bg-sky-950"
        details={
          <div className="flex items-center gap-x-1 text-xs">
            <span>0%</span>
            <AiOutlineFall className="w-4 h-4" />
          </div>
        }
      />
      <CounterCard
        title="Orders"
        counter={0}
        details={
          <div className="flex items-center gap-x-1 text-xs">
            <span>0%</span>
            {/* <span>+1.02%</span> */}
            <AiOutlineRise className="w-4 h-4" />
          </div>
        }
      />
      <CounterCard
        title="Customers"
        counter={0}
        className="bg-sky-100 dark:bg-sky-950"
        details={
          <div className="flex items-center gap-x-1 text-xs">
            <span>0%</span>
            <AiOutlineRise className="w-4 h-4" />
          </div>
        }
      />
      <CounterCard
        title="Revenue"
        counter={0}
        currency="$"
        details={
          <div className="flex items-center gap-x-1 text-xs">
            <span>0%</span>
            <AiOutlineRise className="w-4 h-4" />
          </div>
        }
      />
      <div className="row-start-3 col-span-3 py-6 rounded-lg">
        <h3 className="font-semibold text-xs mb-6">Sales</h3>
        <SalesChart />
      </div>

      <div className="p-6 rounded-lg">
        <h3 className="font-semibold text-xs mb-8">Traffic by country</h3>
        <TrafficView />
      </div>
    </div>
  )
}
