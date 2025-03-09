import { useEffect } from 'react';
import { Table, Button, Space, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useGetAllTasksQuery, useStartTradingMutation, useStopTradingMutation } from '../store/api/trading/tradingApi';
import { TradingTask } from '../store/api/trading/tradingInterface';

const Tasks = () => {
    const { data: tasks, isLoading } = useGetAllTasksQuery();
    const [startTrading] = useStartTradingMutation();
    const [stopTrading] = useStopTradingMutation();


    useEffect(() => {
        console.log(tasks);
    }, [tasks]);

    const columns: TableProps<TradingTask>['columns'] = [
        // {
        //     title: 'ID',
        //     dataIndex: 'taskId',
        //     key: 'taskId',
        // },
        // {
        //     title: 'Символ',
        //     dataIndex: 'symbol',
        //     key: 'symbol',
        // },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : status === 'completed' ? 'blue' : 'red'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Створено',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => new Date(value).toLocaleString('uk-UA'),
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        },
        {
            title: 'Завершено',
            dataIndex: 'completedAt',
            key: 'completedAt',
            render: (value) => new Date(value).toLocaleString('uk-UA'),
        },
        {
            title: 'Ітерацій',
            dataIndex: 'iterationCount',
            key: 'iterationCount',
        },
        {
            title: 'Позицій',
            dataIndex: 'findOrders',
            key: 'findOrders',
        },
        {
            title: 'Params',
            dataIndex: 'params',
            key: 'params',
            render: (_, a) => <div>

                <div>лонг: {a.params?.longProbabilityValue}</div>
                <div>шорт: {a.params?.shortProbabilityValue}</div>
            </div>,
        },
        {
            title: 'таймфрейм',
            dataIndex: 'timeframe', 
            key: 'timeframe',
            render: (_, a) => a.params?.timeframe,
        },
        {
            title: 'Дії',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'ACTIVE' ? (
                        <Button 
                            danger
                            onClick={() => stopTrading(record.taskId)}
                        >
                            Зупинити
                        </Button>
                    ) : (
                        // <Button 
                        //     type="primary"
                        //     onClick={() => startTrading({ symbol: record.symbol })}
                        // >
                        //     Запустити
                        // </Button>
                        null
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h1>Торгові завдання</h1>
            <Table<TradingTask>
                dataSource={tasks || []}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
            />
        </div>
    );
};

export default Tasks;