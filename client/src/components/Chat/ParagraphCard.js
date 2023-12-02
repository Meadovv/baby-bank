const ParagraphCard = ({ content }) => {
    return (
        <>
        {
            content.split('\n').map((row, index) => {

                return (
                    <p key={index} style={{
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