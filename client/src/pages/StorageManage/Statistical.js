import MilkTotalChart from "../../components/Chart/MilkTotalChart"
import MilkMonthChart from "../../components/Chart/MilkMonthChart"

const Statistical = ({ storage, chart, onChangeStorage }) => {

    return (
        <>
            <MilkTotalChart storage={storage} onChangeStorage={onChangeStorage}/>
            <MilkMonthChart chart={chart} />
        </>
    )
}

export default Statistical