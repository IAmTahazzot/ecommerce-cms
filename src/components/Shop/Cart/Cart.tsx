'use client'

import { ShoppingCart } from "lucide-react"
import Button from "../Button/Button"

const Cart = () => {
    return (
        <div className='ml-auto'>
            <Button className=' flex items-center gap-x-[6px] bg-black text-white'>
                <ShoppingCart size={18} />
                <span className='text-sm'>7</span>
            </Button>
        </div>
    )
}

export default Cart