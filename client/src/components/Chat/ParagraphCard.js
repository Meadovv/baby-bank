const ParagraphCard = ({ content }) => {
    return (
        <>
        {
            content.split('\n').map(row => {

                return (
                    <p style={{
                        fontSize: 14,
                        lineHeight: 1.5,
                        textAlign: 'justify'
                    }}>{row}</p>
                )
            })
        }
        </>
    )
}

export default ParagraphCard