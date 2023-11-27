import Layout from "../../components/Layout/Layout"

const Error = () => {

    return (
        <Layout>
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 30
            }}>
                <img src='/images/error.png' alt="error" style={{
                    width: '50%'
                }}/>
            </div>
        </Layout>
    )
}

export default Error