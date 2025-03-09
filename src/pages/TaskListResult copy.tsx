import { useParams } from 'react-router-dom';
import {  useGetTradeSimulationListQuery } from '../store/api/trading/tradingApi';
import { Card, Table, Tabs, Statistic, Row, Col, Tag } from 'antd';
import type { TableProps } from 'antd';
import { TradeResult } from '../store/api/trading/tradingInterface';
import { useEffect } from 'react';

const TaskResult = () => {
    const { taskId } = useParams();
    const { data: simulations, isLoading: isSimulationsLoading } = useGetTradeSimulationListQuery(taskId || '');


    useEffect(() => {
        console.log(simulations);
    }, [simulations]);

    if (isSimulationsLoading) {
        return <div>Завантаження...</div>;
    }

    const tradeColumns: TableProps<TradeResult>['columns'] = [
        {
            title: 'Символ',
            dataIndex: 'symbol',
            key: 'symbol',
        },
        {
            title: 'Сторона',
            dataIndex: 'recommendation',
            key: 'recommendation',
            render: (side) => (
                <Tag color={side === 'LONG'? 'green' : 'red'}>
                    {side}
                </Tag>
            ),
        },
        {
            title: 'Ціна входу',
            dataIndex: 'entryPrice',
            key: 'entryPrice',
        },
        // {
        //     title: 'Ціна виходу',
        //     dataIndex: 'exitPrice',
        //     key: 'exitPrice',
        // },
        {
            title: 'Прибуток',
            dataIndex: 'profit',
            key: 'profit',
            render: (profit) => (
                <span style={{ color: profit >= 0 ? 'green' : 'red' }}>
                    {profit.toFixed(2)}
                </span>
            ),
        },
        {
            title: 'Час входу',
            dataIndex: 'entryTime',
            key: 'entryTime',
            render: (time) => new Date(time).toLocaleString('uk-UA'),
        },
        {
            title: 'Час виходу',
            dataIndex: 'executionTime',
            key: 'executionTime',
            render: (time) => new Date(time).toLocaleString('uk-UA'),
        },
    ];

    return (
        <div>
            <h1>Результати завдання: {taskId}</h1>
            {simulations?.map((simulation) => (
                <Card key={simulation._id} style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Statistic 
                                title="Успішність" 
                                value={simulation.result.successRate} 
                                suffix="%" 
                            />
                        </Col>
                        <Col span={6}>
                            <Statistic 
                                title="Всього угод" 
                                value={simulation.result.total} 
                            />
                        </Col>
                        <Col span={6}>
                            <Statistic 
                                title="Прибуткових" 
                                value={simulation.result.profitable}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Col>
                        <Col span={6}>
                            <Statistic 
                                title="Збиткових" 
                                value={simulation.result.unprofitable}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Col>
                    </Row>

                    <Table
                        columns={tradeColumns}
                        dataSource={[...simulation.result.profitableDetails, ...simulation.result.unprofitableDetails ]                       }
                        rowKey={(record) => `${record.symbol}-${record.timestamp}`}
                    />
                </Card>
            ))}
        </div>
    );
};

export default TaskResult;