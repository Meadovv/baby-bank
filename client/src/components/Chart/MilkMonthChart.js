import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Divider } from 'antd';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
}

const MilkMonthChart = ({ chart }) => {

    return (
        <>
            <Divider orientation="left" style={{
                borderColor: 'black',
                padding: 10,
                marginTop: 50
            }}>
                <h2 style={{
                    textTransform: 'uppercase'
                }}>THU VÀ LẤY SỮA CỦA BỆNH VIỆN TRONG 10 THÁNG GẦN ĐÂY</h2>
            </Divider>
            <Bar options={options} data={chart} style={{
                marginTop: 20
            }} />
        </>
    )
}

export default MilkMonthChart