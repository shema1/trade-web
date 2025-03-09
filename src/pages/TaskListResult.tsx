import { useParams } from 'react-router-dom';
import { useGetTradeSimulationListQuery } from '../store/api/trading/tradingApi';
import { Card, Table, Statistic, Row, Col, Tag } from 'antd';
import type { TableProps } from 'antd';
import { TradeResult, TradingTaskResult } from '../store/api/trading/tradingInterface';
import { useEffect } from 'react';

const TaskListResult = () => {
    const { taskId } = useParams();
    const { data: simulations, isLoading: isSimulationsLoading } = useGetTradeSimulationListQuery(taskId || '');


    useEffect(() => {
        console.log(simulations);
    }, [simulations]);

    if (isSimulationsLoading) {
        return <div>Завантаження...</div>;
    }

    const tradeColumns: TableProps<TradingTaskResult>['columns'] = [
        {   
            title: 'Успішність',
            dataIndex: 'successRate',
            key: 'successRate',
            render: (_, record) => {
                return <Statistic 
                    title="Успішність"  
                    value={record.result.successRate} 
                    suffix="%" 
                    valueStyle={{ 
                        color: record.result.successRate >= 50 ? '#3f8600' : '#cf1322'
                    }}
                />
            },
        },
        {
            title: 'Всього угод',   
            dataIndex: 'total',
            key: 'total',
            render: (_, record) => {
                return <Statistic 
                    title="Всього угод" 
                    value={record.result.total}
                    valueStyle={{ color: '#1677ff' }} // синій колір
                />
            },
        },
        {
            title: 'Прибуткових',
            dataIndex: 'profitable',
            key: 'profitable',
            render: (_, record) => {
                return <Statistic 
                    title="Прибуткових" 
                    value={record.result.profitable}
                    valueStyle={{ color: '#3f8600' }} // зелений колір
                />
            },
        },     
        {
            title: 'Збиткових',
            dataIndex: 'unprofitable',
            key: 'unprofitable',
            render: (_, record) => {
                return <Statistic 
                    title="Збиткових" 
                    value={record.result.unprofitable}
                    valueStyle={{ color: '#cf1322' }} // червоний колір
                />
            },
        },
        {
            title: 'Відкритих',
            dataIndex: 'openPositionsCount',
            key: 'openPositionsCount',
            render: (_, record) => {
                return <Statistic title="Відкритих" value={record.result.openPositionsCount} />
            },
        },
        {
            title: 'Профіт',
            dataIndex: 'profit',
            key: 'profit',
            render: (_, record) => {
                return <Statistic title="Профіт" value={record.result.profit.toFixed(2)}  valueStyle={{ color: '#3f8600' }}/>
            },
        },
        {
            title: 'Втрати',
            dataIndex: 'lost',
            key: 'lost',
            render: (_, record) => {
                return <Statistic title="Втрати" value={record.result.lost.toFixed(2)} valueStyle={{ color: '#cf1322' }} />
            },
        },
        
        

        // {
        //     title: 'Символ',
        //     dataIndex: 'symbol',
        //     key: 'symbol',
        // },
        // {
        //     title: 'Сторона',
        //     dataIndex: 'recommendation',
        //     key: 'recommendation',
        //     render: (side) => (
        //         <Tag color={side === 'LONG' ? 'green' : 'red'}>
        //             {side}
        //         </Tag>
        //     ),
        // },
        // {
        //     title: 'Ціна входу',
        //     dataIndex: 'entryPrice',
        //     key: 'entryPrice',
        // },
        // {
        //     title: 'Ціна виходу',
        //     dataIndex: 'exitPrice',
        //     key: 'exitPrice',
        // },
        // {
        //     title: 'Прибуток',
        //     dataIndex: 'profit',
        //     key: 'profit',
        //     render: (profit) => (
        //         <span style={{ color: profit >= 0 ? 'green' : 'red' }}>
        //             {profit.toFixed(2)}
        //         </span>
        //     ),
        // },
        // {
        //     title: 'Час входу',
        //     dataIndex: 'entryTime',
        //     key: 'entryTime',
        //     render: (time) => new Date(time).toLocaleString('uk-UA'),
        // },
        // {
        //     title: 'Час виходу',
        //     dataIndex: 'executionTime',
        //     key: 'executionTime',
        //     render: (time) => new Date(time).toLocaleString('uk-UA'),
        // },
    ];

    return (
        <div>
            <Table
                columns={tradeColumns}
                dataSource={simulations}
                rowKey={(record) => record._id as string} 
            />
            {/* <h1>Результати завдання: {taskId}</h1>
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
            ))} */}
        </div>
    );
};

export default TaskListResult;