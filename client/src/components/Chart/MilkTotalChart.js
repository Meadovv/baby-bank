import { Card, Row, Col, Space, Statistic, Divider } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import StorageManageModal from "../../components/Modal/StorageManageModal"

const MilkAmountChart = ({ storage, onChangeStorage }) => {

    return (
        <Row>
            <Col span={16} style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
                <Divider orientation="left" style={{
                    borderColor: 'black',
                    padding: 10
                }}>
                    <h2 style={{
                        textTransform: 'uppercase'
                    }}>TỔNG LƯỢNG SỮA</h2>
                </Divider>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                }}>
                    <div style={{
                        fontSize: 100,
                        fontWeight: 'bold',
                        color: '#00308F'
                    }}>{storage.total}</div>
                    <div style={{
                        fontSize: 30,
                        color: '#00308F'
                    }}>ml</div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '60%',
                    marginTop: 10
                }}>
                    <div style={{
                        color: '#cf1322',
                        fontSize: 20
                    }}><ArrowDownOutlined /> Thu vào: {storage.income} ml</div>
                    <div style={{
                        color: '#3f8600',
                        fontSize: 20
                    }}><ArrowUpOutlined /> Lấy ra: {storage.outcome} ml</div>
                </div>
            </Col>
            <Col span={8}>
                <Space direction='vertical' style={{
                    width: '100%'
                }}>
                    <Card bordered={false} hoverable>
                        <Statistic
                            title="Thu vào tháng này"
                            value={storage.this_month.income}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ArrowDownOutlined />}
                            suffix="ml"
                        />
                    </Card>
                    <Card bordered={false} hoverable>
                        <Statistic
                            title="Lấy ra tháng này"
                            value={storage.this_month.outcome}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="ml"
                        />
                    </Card>
                    <Space>
                        <StorageManageModal onChange={onChangeStorage} action={'push'}/>
                        <StorageManageModal onChange={onChangeStorage} action={'pop'}/>
                    </Space>
                </Space>
            </Col>
        </Row>
    )
}

export default MilkAmountChart