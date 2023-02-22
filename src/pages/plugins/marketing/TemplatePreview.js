import { useRouter } from 'next/router'

const TemplatePreview = () => {
    const router = useRouter()
    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: router?.query?.state }}></div>
        </div>
    )
}

export default TemplatePreview
