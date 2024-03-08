// import { headers } from 'next/headers'
'use client'

import { CounterCard } from "@/components/Widgets/CounterCard";
import { SalesChart } from "@/components/Widgets/SalesChart";
import { TrafficView } from "@/components/Widgets/TrafficView";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";
import { extractStoreUrl } from '@/lib/utils';

// const headersList = headers()
// const storeUrl = extractStoreUrl(headersList.get('host') || '')

// if (!storeUrl) {
//   throw new Error('Invalid store URL.')
// }
export default function Home() {


  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-start-1 col-end-5">
        <h3 className="text-sm font-semibold">Overview</h3>
      </div>
      <CounterCard
        title="Sales"
        counter={1_000}
        currency="$"
        className="bg-sky-100"
        details={
          <div className="flex items-center gap-x-1 text-xs">
            <span>-0.80%</span>
            <AiOutlineFall className="w-4 h-4" />
          </div>
        }
      />
      <CounterCard
        title="Orders"
        counter={76}
        details={
          <div className="flex items-center gap-x-1 text-xs">
            <span>+1.02%</span>
            <AiOutlineRise className="w-4 h-4" />
          </div>
        }
      />
      <CounterCard
        title="Customers"
        counter={90}
        className="bg-sky-100"
        details={
          <div className="flex items-center gap-x-1 text-xs">
            <span>+0.32%</span>
            <AiOutlineRise className="w-4 h-4" />
          </div>
        }
      />
      <CounterCard
        title="Revenue"
        counter={3_231}
        currency="$"
        details={
          <div className="flex items-center gap-x-1 text-xs">
            <span>+0.92%</span>
            <AiOutlineRise className="w-4 h-4" />
          </div>
        }
      />
      <div className="row-start-3 col-span-3 p-6 bg-neutral-100 rounded-lg">
        <h3 className='font-semibold text-xs mb-6'>Sales</h3>
        <SalesChart />
      </div>

      <div className='p-6 bg-neutral-100 rounded-lg'>
        <h3 className='font-semibold text-xs mb-8'>Traffic by country</h3>
        <TrafficView />
      </div>
    </div>
  );
}
