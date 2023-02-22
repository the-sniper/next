import { cloneElement, useState, useContext, useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import ProductContext from '@/context/product/productContext'
import { mapData } from '@/common/components'
import PrimaryButton from '@/components/atoms/PrimaryButton'
import Block1 from './TemplateBlocks/Block1'
import Block2 from './TemplateBlocks/Block2'
import Block3 from './TemplateBlocks/Block3'
import BlockFooter from './TemplateBlocks/BlockFooter'
import BlockHeader from './TemplateBlocks/BlockHeader'
import styles from './templateBuilder.module.css'
import * as Yup from 'yup'
// import { getAllStyles } from '@/utils/index.js'
import AlertContext from '@/context/alert/alertContext'
import Block4 from './TemplateBlocks/Block4'
import Block5 from './TemplateBlocks/Block5'
import { Button } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'

const TemplateBuilder = (props) => {
    const {
        store_details,
        getLots,
        getTemplates,
        saveTemplate,
        success,
        saved_templates,
        responseStatus,
    } = useContext(ProductContext)
    const { enqueueSnackbar } = useSnackbar()
    const { setAlert } = useContext(AlertContext)
    const router = useRouter()
    const siteId = router.query
    const [template, setTemplate] = useState([])
    const [option, setOption] = useState([])
    const [successMessage, setSuccessMessage] = useState('')
    const [templateBlocks] = useState([
        <Block1 bgColor="#fff" text1="<p>Sample Text</p>" />,
        <Block2 />,
        <Block3 />,
        <Block4 />,
        <Block5 />,
    ])
    const validationSchema = Yup.object().shape({
        templateName: Yup.string().max(250, '250 characters max').required('Required'),
    })
    const formik = useFormik({
        initialValues: {
            templateName: '',
            chooseTemplate: '',
        },
        validationSchema,
        onSubmit: (value) => {
            var temp_template = template
            if (!temp_template.length) {
                return setAlert('Start customization and then save template!', 'error')
            }
            temp_template.map((val) => {
                val.component = val.templateIndex
            })
            const send_body = {
                template_name: value.templateName,
                template: JSON.stringify(temp_template),
                siteId,
            }
            saveTemplate(send_body)
            var interval = setInterval(() => {
                if (localStorage.getItem('success') === 'true') {
                    enqueueSnackbar('Template Saved Successfully!', {
                        variant: 'success',
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        preventDuplicate: true,
                    })
                    // formik.resetForm();
                    // getTemplates({ siteId });
                    localStorage.removeItem('success')
                    clearInterval(interval)
                }
            }, 1000)
        },
    })

    const resetFormik = (value) => formik.resetForm()
    const fields = [
        {
            label: 'Choose Saved Template',
            placeholder: 'Select your template',
            class: 'col-12 col-md-4',
            type: 'select',
            options: option,
            name: 'chooseTemplate',
            formik: formik,
            onChange: (e) => {
                let parsedArray = JSON.parse(
                    option.find((val) => val.id == e.target.value)?.template,
                )

                parsedArray.map((val) => {
                    val.component = templateBlocks[val.component]
                })

                setTemplate(parsedArray)
                formik.setFieldValue('chooseTemplate', e.target.value)
            },
        },
        {
            label: 'Save Your Template',
            type: 'text',
            placeholder: 'Enter Template Name',
            class: 'col-12 col-md-4',
            name: 'templateName',
            formik: formik,
        },
    ]
    const handleClick = (index) => {
        setTemplate((prev) => [
            ...prev,
            {
                id: template.length,
                templateIndex: index,
                component: templateBlocks[index],
                colorPopup: false,
                textPopup: false,
                imagePopup: false,
                bgColor: '#fff',
                text1: '<p>Sample Text 1</p>',
                text2: '<p>Sample Text 2</p>',
                image1: '',
                image2: '',
                image3: '',
                image4: '',
            },
        ])
    }
    const handleDelete = (index) => {
        const tempArray = template
        tempArray.splice(index, 1)
        setTemplate([...tempArray])
    }
    const handleMove = (type, index) => {
        const tempArray = template
        if (type === 'up') {
            if (index - 1 > -1) {
                console.log('up')
                tempArray.move(index, index - 1)
            }
        }
        if (type === 'down') {
            if (index + 1 < tempArray.length) {
                tempArray.move(index, index + 1)
            }
        }
        setTemplate([...tempArray])
    }
    const handleOpen = (index) => {
        const tempArray = template
        tempArray[index]['colorPopup'] = !tempArray[index]['colorPopup']
        setTemplate([...tempArray])
    }
    useEffect(() => {
        getLots({ siteId })
        getTemplates({ siteId })
    }, [])

    useEffect(() => {
        saved_templates.map((val) => {
            val.show = val.title
            val.value = val.id
        })
        setOption(saved_templates)
    }, [saved_templates])
    useEffect(() => {
        if (success) {
            setAlert(success)
        }
    }, [success])

    return (
        <div className={`container ${styles.customTemplateViewContainer}`}>
            <div className="row">
                {Object.values(mapData(fields))}
                <div className="col-12 col-md-4">
                    <PrimaryButton
                        variant="contained"
                        color="primary"
                        // disabled={formik.isSubmitting}
                        onClick={formik.handleSubmit}
                    >
                        Save
                    </PrimaryButton>
                </div>
            </div>
            <div className={`row ${styles.emlTemplBuldWrapper}`}>
                <div className="col-12 col-md-4">
                    <div className={styles.lftCustomContainer}>
                        <h2 className={styles.emlTip}>Click a section to add to the email</h2>
                        {templateBlocks.map((val, key) => (
                            <div key={key} onClick={() => handleClick(key)} className="pointer">
                                {cloneElement(val, { key, preview: true })}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-12 col-md-8">
                    <div className={styles.ritCustomContainer}>
                        <h2 className={styles.emlTip}>
                            Click an image block to assign an image to it
                        </h2>
                        <div ref={props.templateRef}>
                            <table id="emailTemplate" style={{ width: '600px', margin: 'auto' }}>
                                <tr>
                                    <td>
                                        <BlockHeader storeDetails={store_details} />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                                        {template.map((val, key) => (
                                            <table
                                                style={{ width: '100%' }}
                                                className="bldrUqTable"
                                            >
                                                <tr>
                                                    <td>
                                                        {val.templateIndex === 1 ? null : (
                                                            <div
                                                                id="emailTemplateBlockToolbar"
                                                                className={`clearfix ${styles.builderTools}`}
                                                                style={{
                                                                    display: 'none',
                                                                }}
                                                            >
                                                                <Button
                                                                    onClick={() =>
                                                                        handleDelete(key)
                                                                    }
                                                                >
                                                                    <span className="material-icons">
                                                                        clear
                                                                    </span>
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleOpen(key)}
                                                                >
                                                                    <span className="material-icons">
                                                                        launch
                                                                    </span>
                                                                </Button>
                                                                <Button
                                                                    onClick={() =>
                                                                        handleMove('up', key)
                                                                    }
                                                                >
                                                                    <span className="material-icons">
                                                                        keyboard_arrow_up
                                                                    </span>
                                                                </Button>
                                                                <Button
                                                                    onClick={() =>
                                                                        handleMove('down', key)
                                                                    }
                                                                >
                                                                    <span className="material-icons">
                                                                        keyboard_arrow_down
                                                                    </span>
                                                                </Button>
                                                            </div>
                                                        )}
                                                        {cloneElement(val.component, {
                                                            key,
                                                            colorPopup: val.colorPopup,
                                                            textPopup: val.textPopup,
                                                            imagePopup: val.imagePopup,
                                                            bgColor: val.bgColor,
                                                            text1: val.text1,
                                                            text2: val.text2,
                                                            image1: val.image1,
                                                            image2: val.image2,
                                                            image3: val.image3,
                                                            image4: val.image4,
                                                            index: key,
                                                            template,
                                                            setTemplate,
                                                        })}
                                                    </td>
                                                </tr>
                                            </table>
                                        ))}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <BlockFooter storeDetails={store_details} />
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TemplateBuilder
