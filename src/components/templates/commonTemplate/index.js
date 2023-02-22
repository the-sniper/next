import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'
import { useRouter } from 'next/router'

function CommonTemplate({ children }) {
    const router = useRouter()
    return (
        <>
            <Header />
            <div>{children}</div>
            <Footer />
        </>
    )
}

export default CommonTemplate
