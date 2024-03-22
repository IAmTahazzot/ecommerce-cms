import getCategories from "@/actions/get-categories"
import Nav, { StickyNav } from "./Nav"
import Announcement from "./Announcement"
import NavSearch from "./NavSearch"

const Header = async ( { shopUrl } : { shopUrl: string }) => {
    const categories = await getCategories( { storeUrl: shopUrl } )

    return (
        <header>
            <Announcement />
            <NavSearch shopName={shopUrl} />
            <Nav categories={categories} />
            <StickyNav categories={categories} />
        </header>
    )
}

export default Header