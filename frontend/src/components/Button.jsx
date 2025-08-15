import React from 'react'

const Button = ({handle = () => {}, content}) => {
    return (
        <button type="submit" className='bg-blue-400 font-medium w-full rounded mt-5 p-3'
            onClick={handle}>
            {content}
        </button>
    )
}

export default Button