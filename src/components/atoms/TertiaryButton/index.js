import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            width: '100%',
            height: '60px',
        },
    },
}))

const ColorButton = withStyles((theme) => ({
    root: {
        color: 'var(--primColor)',
        borderRadius: '3px',
        boxShadow: '0px 4px 12px rgba(var(--primColor), 20%)',
        backgroundColor: '#E7F5FD',
        border: 'transparent',
        transition: '200ms all ease-in-out',

        '&:hover': {
            backgroundColor: 'var(--primColor)',
            color: '#fff',
            border: 'transparent',
            opacity: '0.9',
            boxShadow: '0px 4px 12px rgba(var(--primColor), 20%)',
        },
    },
}))(Button)

const TertiaryButton = (props) => {
    const classes = useStyles()

    return (
        <div className={`${classes.root} ${props.btnSize} tertButton`}>
            <ColorButton
                variant="contained"
                color="primary"
                id={props.id}
                onClick={props.onClick}
                type={props.type}
            >
                {props.iconLeft}
                {props.label}
                {props.children}
            </ColorButton>
        </div>
    )
}

export default TertiaryButton
