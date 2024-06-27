'use client'

import Container from '@/components/Shop/Layout/Container'
import { useCart } from '@/hooks/useCart'
import { ModalType, useModal } from '@/hooks/useModal'
import { cn } from '@/lib/utils'
import { Image as ImageType, Product, Variant } from '@prisma/client'
import { Search, ShoppingCart } from 'lucide-react'
import localFont from 'next/font/local'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const SACRAMENTO_FONT = localFont({
  src: '../../../../public/fonts/RemachineScript.ttf',
  display: 'swap',
})

type ProductType = Product & { images: ImageType[]; variants: Variant[] }

/**
 *
 * @param param0 shopName is the name of the shop
 * @returns React component
 *
 * This component is the navbar of the shop page. It contains the shop name, search bar and cart icon.
 * It also displays the total price and quantity of the items in the cart.
 *
 * @warning Products are fetched before search to optimize the search. This is not a good practice as it can slow down the initial load time. (but it's okay for this project)
 */
const NavSearch = ({ shopName }: { shopName: string }) => {
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [products, setProducts] = useState<ProductType[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [searchResults, setSearchResults] = useState<ProductType[]>([])
  const [showResults, setShowResults] = useState(false)

  const { openModal } = useModal()
  const { carts } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?shopUrl=${shopName}`)
        const data = await res.json()
        setProducts(data.products)
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    window.addEventListener('click', () => {
      setShowResults(false)
    })
  }, [])

  useEffect(() => {
    let price: number = 0

    carts.forEach((cart) => {
      if (cart.variant && cart.variant.price) {
        price += cart.variant.price * cart.quantity
      } else {
        price += cart.product.price * cart.quantity
      }
    })

    const quantity = carts.reduce((acc, item) => acc + item.quantity, 0)
    setTotalQuantity(quantity)
    setTotalPrice(parseFloat(price.toFixed(2)))
  }, [carts])

  const search = (query: string) => {
    if (query === '') {
      setSearchResults([])
      return
    }

    const results = products.filter((product) => product.title.toLowerCase().includes(query.toLowerCase()))
    setSearchResults(results)
  }

  const path = usePathname()
  const shopUrl = '/shop/' + path.split('/')[2]
  const beautifyShopName = shopName.replace(/-/g, ' ').slice(0, 1).toUpperCase() + shopName.replace(/-/g, ' ').slice(1)

  return (
    <>
      <div className="border-b-[1px]">
        <Container className="grid grid-cols-[auto_1fr] align-center justify-between py-3 md:py-8">
          <div className="w-auto md:w-[360px]" aria-label="brand name or logo">
            <Link href={shopUrl}>
              <h1 className={cn(SACRAMENTO_FONT.className, 'text-[48px] leading-[1]')}>{beautifyShopName}</h1>
            </Link>
          </div>
          <div className="h-12 flex items-center justify-end gap-x-3">
            <div className="hidden md:block search-bar relative h-full flex-1">
              <span className="absolute top-1/2 left-4 transform -translate-y-1/2">
                <Search size={20} className="text-neutral-800" />
              </span>
              <input
                disabled={loadingProducts}
                className="border rounded-full placeholder:text-slate-500 h-full w-full pl-11 pr-3"
                type="text"
                placeholder={loadingProducts ? 'Prefetching products...' : 'Search'}
                onInput={(e) => search(e.currentTarget.value)}
                onFocus={(e) => {
                  e.stopPropagation()
                  setShowResults(true)
                }}
                onClick={(e) => e.stopPropagation()}
              />
              {
                // Show search results only when the search bar is focused
                showResults && (
                  <div
                    className="absolute w-full z-10 lg:max-w-[400px] min-h-[10vh] top-[105%] bg-white shadow-md rounded-xl p-3"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    {searchResults.map((product) => (
                      <SearchProduct key={product.productId} product={product} />
                    ))}
                    {searchResults.length === 0 && (
                      <p className="text-center text-muted-foreground text-sm py-3">
                        Search something else or try again
                      </p>
                    )}
                  </div>
                )
              }
            </div>
            <button
              onClick={() => openModal(ModalType.CART)}
              className="rounded-full bg-[#1d1d1d] font-medium text-white space-x-2 h-full flex items-center px-5"
            >
              <ShoppingCart size={20} />
              <span>${totalPrice}</span>
              <span>({totalQuantity})</span>
            </button>
          </div>
        </Container>
      </div>
      <div>
        <Container>
          <div className="block md:hidden search-bar relative py-3">
            <span className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <Search size={20} className="text-neutral-800" />
            </span>
            <input
              disabled={loadingProducts}
              className="border rounded-full placeholder:text-slate-500 h-12 w-full pl-11 pr-3"
              type="text"
              placeholder={loadingProducts ? 'Prefetching products...' : 'Search'}
              onInput={(e) => search(e.currentTarget.value)}
              onFocus={(e) => {
                e.stopPropagation()
                setShowResults(true)
              }}
              onClick={(e) => e.stopPropagation()}
            />
            {
              // Show search results only when the search bar is focused
              showResults && (
                <div
                  className="absolute w-full z-10 lg:max-w-[400px] min-h-[10vh] top-[105%] bg-white shadow-md rounded-xl p-3"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  {searchResults.map((product) => (
                    <SearchProduct key={product.productId} product={product} />
                  ))}
                  {searchResults.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm py-3">Search something else or try again</p>
                  )}
                </div>
              )
            }
          </div>
        </Container>
      </div>
    </>
  )
}

const SearchProduct = ({ product }: { product: ProductType }) => {
  const path = usePathname()
  const shopUrl = path.split('/')[2]

  return (
    <div>
      <Link href={`/shop/${shopUrl}/product/${product.productId}`}>
        <div className="flex gap-x-2 hover:bg-slate-50 rounded-lg p-2">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden">
            <Image
              src={'https://utfs.io/f/' + product.images[0].imageUrl}
              fill
              className="object-cover"
              alt={product.title}
            />
          </div>
          <div>
            <h1 className="font-semibold mb-1">{product.title}</h1>
            <p>${product.price.toFixed(2)}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default NavSearch
