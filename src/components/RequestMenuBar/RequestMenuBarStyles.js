const MenuBarStyles = {
    bar: {
        width: '20rem',
        height: '4rem',
        position: 'relative',
        top: '8vh',
        backgroundColor: 'rgba(77, 71, 66)',
        '& *': {
            color: 'white'
        },
        marginBottom: '5vw',
        paddingLeft: '1vw',
        paddingRight: '1vw',
        borderRadius: '10vw'
    },
    list: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)'
    },
    listOption: {
        display: 'inline',
        textAlign: 'center'
    }
}

export default MenuBarStyles;