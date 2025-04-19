import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    useGetAllTasksQuery,
    useCreateTaskMutation,
    useStopTaskMutation
} from '../store/api/trading-tasks/trading-tasksApi';
import {
    TradingTask,
    CreateTradingTaskDto,
    TradingTaskStatus
} from '../store/api/trading-tasks/trading-tasks-Interface';
import CreateTradingTaskModal from '../components/CreateTradingTaskModal';
import {UndoOutlined} from '@ant-design/icons';


const Tasks = () => {
    const navigate = useNavigate();
    const { data: tasks, isLoading, refetch } = useGetAllTasksQuery();
    const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
    const [stopTask] = useStopTaskMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTradingModalOpen, setIsTradingModalOpen] = useState(false);

    const handleCreateTask = async (values: CreateTradingTaskDto) => {
        try {
            await createTask(values).unwrap();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const handleRowClick = (record: TradingTask) => {
        navigate(`/task-result/${record._id}`);
    };

    const columns: TableProps<TradingTask>['columns'] = [
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: TradingTaskStatus) => (
                <Tag color={
                    status === TradingTaskStatus.ACTIVE ? 'green' :
                        status === TradingTaskStatus.COMPLETED ? 'blue' :
                            status === TradingTaskStatus.ERROR ? 'red' :
                                status === TradingTaskStatus.PENDING ? 'orange' : 'red'
                }>
                    {status}
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
            title: 'Ітерацій',
            dataIndex: 'iterationCount',
            key: 'iterationCount',
        },
        {
            title: 'Активних позицій',
            dataIndex: 'activeOrders',
            key: 'activeOrders',
            render: (orders) => orders?.length || 0,
            sorter: (a, b) => a.activeOrders.length - b.activeOrders.length,
        },
        {
            title: 'Закритих позицій',
            dataIndex: 'completedOrders',
            key: 'completedOrders',
            render: (orders) => orders?.length || 0,
            sorter: (a, b) => a.completedOrders.length - b.completedOrders.length,
        },
        {
            title: 'Profit',
            dataIndex: 'analysisResultsProfit',
            key: 'analysisResultsProfit',
            render: (results) => results?.length || 0,
            sorter: (a, b) => a.analysisResultsProfit.length - b.analysisResultsProfit.length,
        },
        {
            title: 'Loss',
            dataIndex: 'analysisResultsLoss',
            key: 'analysisResultsLoss',
            render: (results) => results?.length || 0,
            sorter: (a, b) => a.analysisResultsLoss.length - b.analysisResultsLoss.length,
        },
        {
            title: 'PNL',
            render: (_, record) => {
                const totalProfit = record.completedOrders.reduce((acc, order) => acc + order.pnl, 0);
                return <div>
                    <div>
                        <span>{totalProfit.toFixed(2)}</span>
                    </div>
                </div>
            },
            sorter: (a, b) => a.completedOrders.reduce((acc, order) => acc + order.pnl, 0) - b.completedOrders.reduce((acc, order) => acc + order.pnl, 0),
        },
        {
            title: 'відсоток успішних угод',
            render: (_, record) => {
                const total = record.completedOrders.length;
                const res = record.analysisResultsProfit?.length * 100 / total
                return <div>
                    <div>{res ? res.toFixed(2) : 0}%</div>
                </div>
            },

        },
        {
            title: 'Параметри',
            dataIndex: 'params',
            key: 'params',
            render: (params) => (
                <div>
                    <div>Таймфрейм: {params.timeframe}</div>
                    <div>Ставка: {params.betSize}</div>
                    <div>SL: {params.stopLoss}%</div>
                    <div>TP: {params.takeProfit}%</div>
                </div>
            ),
        },
        {
            title: 'Дії',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === TradingTaskStatus.ACTIVE && (
                        <Button
                            danger
                            onClick={(e) => {
                                e.stopPropagation();
                                stopTask(record._id);
                            }}
                        >
                            Зупинити
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Торгові завдання</h1>
                <Space>
                    <Button
                        type="primary"
                        onClick={() => setIsTradingModalOpen(true)}
                    >
                        Створити торгове завдання
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            console.log('Оновити');
                            refetch();
                        } }>
                        <UndoOutlined />
                    </Button>

                </Space>
            </div>

            <Table<TradingTask>
                dataSource={tasks || []}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: { cursor: 'pointer' }
                })}
            />

            <CreateTradingTaskModal
                isOpen={isTradingModalOpen}
                onClose={() => setIsTradingModalOpen(false)}
                onSubmit={handleCreateTask}
                isLoading={isCreating}
            />
        </div>
    );
};

export default Tasks;