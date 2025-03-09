import { useParams } from 'react-router-dom';
import { useGetTradeSimulationListQuery } from '../store/api/trading/tradingApi';
import { Card, Table, Statistic, Row, Col, Tag, Button } from 'antd';
import type { TableProps } from 'antd';
import { TradeResult, TradingTaskResult } from '../store/api/trading/tradingInterface';
import { useEffect, useState } from 'react';
import SimulationModal from '../components/SimulationModal';

const TaskListResult = () => {
    const { taskId } = useParams();
    const { data: simulations, isLoading: isSimulationsLoading } = useGetTradeSimulationListQuery(taskId || '');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        {
            title: '',
            dataIndex: 'stopLossPercent',
            key: 'stopLossPercent',
            render: (_, record) => {
                return record.simulationParams ? <Statistic title="Стоп-лосс" value={record.simulationParams.stopLoss}  valueStyle={{ color: '#cf1322' }}/> : ''
            },
        },
        {
            title: '',
            dataIndex: 'takeProfitPercent',
            key: 'takeProfitPercent',
            render: (_, record) => {
                return record.simulationParams ? <Statistic title="Тейк-профіт" value={record.simulationParams.takeProfit}  valueStyle={{ color: '#3f8600' }}/> : ''
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
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Результати симуляцій</h1>
                <Button 
                    type="primary" 
                    onClick={() => setIsModalOpen(true)}
                >
                    Перевірити профіт
                </Button>
            </div>

            <Table
                columns={tradeColumns}
                dataSource={simulations}
                rowKey={(record) => record._id as string} 
            />

            <SimulationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                taskId={taskId || ''}
            />
        </div>
    );
};

export default TaskListResult;