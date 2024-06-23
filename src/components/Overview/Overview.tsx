'use client'

import { AiOutlineRise, AiOutlineFall } from 'react-icons/ai'
import { CounterCard } from '@/components/Widgets/CounterCard'
import { SalesChart } from '@/components/Widgets/SalesChart'
import { TrafficView } from '@/components/Widgets/TrafficView'
import { useEffect } from 'react'
import { useOverview } from '@/hooks/useOverview'
import queryString from 'query-string'

type OverviewType = {
  shopUrl: string
}

export const Overview = ({ shopUrl }: OverviewType) => {
  const { setSales, setStats, sales, stats } = useOverview()

  useEffect(() => {
    const fetchOverview = async () => {
      const endPoint = queryString.stringifyUrl({
        url: '/api/overview',
        query: { shopUrl },
      })

      const res = await fetch(endPoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok) {
        const data = (await res.json()) as {
          data: {
            stats: {
              sales: number
              customers: number
              orders: number
              revenue: number
            }
            sales: number[]
          }
        }

        const { stats, sales } = data.data

        if (!stats || !sales) {
          return
        }

        setStats(stats)
        setSales(sales)
      }
    }

    fetchOverview()
  }, [])

  return (
    <>
      <CounterCard
        title="Sales"
        counter={Math.floor(stats.sales)}
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
        counter={stats.orders}
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
        counter={stats.customers}
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
        counter={Math.floor(stats.revenue)}
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
    </>
  )
}
