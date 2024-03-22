import Image from "next/image"
import { NavLink } from "../Navbar/NavMenu"

interface ProductProps {
    id: number
    name: string
    price: number
    image: string
}

const Product = () => {
    return (
        <div className='w-[300px] border rounded-[8px] overflow-hidden group/product'>
            <figure className='relative h-[250px] overflow-hidden cursor-pointer'>
                <Image
                    src={'/img/watch.jpg'}
                    fill
                    className='object-cover group-hover/product:scale-110 transition-transform duration-[1s]'
                    priority={true}
                    alt={'watch'} />
            </figure>

            <div className='p-5'>
                <h3 className='text-[20px] mb-1'>$93.50</h3>
                <NavLink href='/product/1' label='Watch' className='inline-block'>
                    <h1 className='text-3xl font-medium'>Watch</h1>
                </NavLink>
            </div>

            <div className='p-5 mb-3'>
                <button className='w-full font-medium text-xl rounded-full bg-white border border-black text-center py-3 px-4 hover:bg-black hover:text-white transition-colors duration-300'>
                    Buy Now
                </button>
            </div>
        </div>
    )
}

export default Product