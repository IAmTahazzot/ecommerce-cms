'use client'

import { ModalType, useModal } from "@/hooks/useModal"
import { cn } from "@/lib/utils"
import { Minus, Plus, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const CartPreview = () => {
    return (
        <div className='px-10 flex gap-x-3 mb-4'>
            <div className="group/cart relative h-28 w-24 rounded-[12px] border overflow-hidden cursor-pointer">
                <Image
                    src='/img/45-a.webp'
                    alt=''
                    fill
                    className='object-cover group-hover/cart:scale-110 transition-transform duration-500' />
            </div>
            <div className='flex flex-col'>
                <h1 className='text-[17px] font-medium tracking-wider'>$17.00</h1>
                <h1 className='text-[17px] font-medium'>Italian Pizza</h1>

                <div className="quantity mt-auto flex items-center gap-x-1">
                    <button className='h-8 w-8 rounded-full border border-nutral-600 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300 hover:border-black'>
                        <Minus size={18} />
                    </button>
                    <span className='mx-3'>1</span>
                    <button className='h-8 w-8 rounded-full border border-nutral-600 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300 hover:border-black'>
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}

const CartModal = () => {
    const { isOpen, type, closeModal } = useModal()
    const shouldOpen: boolean = isOpen && type === ModalType.CART

    return (
        <div className={
            cn(
                'fixed right-0 top-0 h-full bg-white lg:w-[400px] z-[100] shadow-lg overflow-y-auto',
                'translate-x-full transition-transform duration-300 ease-in-out',
                shouldOpen && 'translate-x-0'
            )
        }>
            <header className='flex items-center justify-between p-10'>
                <h1 className='text-2xl font-medium text-[#1d1d1d]'>Your Cart</h1>
                <button onClick={closeModal}>
                    <X size={32} className='cursor-pointer' />
                </button>
            </header>

            <main className="content">
                <CartPreview />
                <CartPreview />
            </main>

            <div className="controls p-10 space-y-3">
                {/* <Link href='all-products' className='rounded-full bg-black text-white py-4 flex items-center justify-center text-[20px] font-medium hover:bg-[#1d1d1d] transition-colors duration-300'>
                    Continue Shopping
                </Link> */}
                <Link href='all-products' className='rounded-full bg-black text-white py-3 flex items-center justify-center text-[20px] font-medium hover:bg-[#1d1d1d] transition-colors duration-300'>
                    View Cart
                </Link>

                <Link href='all-products' className='rounded-full border-2 border-black text-black py-3 hover:text-white flex items-center justify-center text-[20px] font-medium hover:bg-[#1d1d1d] transition-colors duration-300'>
                    Checkout
                </Link>
            </div>
        </div>
    )
}

export default CartModal