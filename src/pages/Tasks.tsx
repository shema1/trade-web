import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useLazyGetAllTasksQuery, useStartAnalysisMutation, useStartTradingMutation, useStopTaskMutation } from '../store/api/trading/tradingApi';
import { TradingTask, StartAnalysisTaskRequest, StartTradingTaskRequest } from '../store/api/trading/tradingInterface';
import CreateTaskModal from '../components/CreateTaskModal';
import CreateTradingTaskModal from '../components/CreateTradingTaskModal';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
    const navigate = useNavigate();
    const [getAllTasks, { data: tasks, isLoading }] = useLazyGetAllTasksQuery();

    const [startAnalysis, { isLoading: isAnalysisStarting }] = useStartAnalysisMutation();
    const [startTrading, { isLoading: isTradingStarting }] = useStartTradingMutation();
    const [stopTask] = useStopTaskMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTradingModalOpen, setIsTradingModalOpen] = useState(false);

    useEffect(() => {
        console.log(tasks);
    }, [tasks]);

    useEffect(() => {
        getAllTasks();
    }, []);

    const handleCreateAnalysisTask = async (values: StartAnalysisTaskRequest) => {
        try {
            await startAnalysis(values).unwrap();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to create analysis task:', error);
        }
    };

    const handleCreateTradingTask = async (values: StartTradingTaskRequest) => {
        try {
            await startTrading(values).unwrap();
            setIsTradingModalOpen(false);
        } catch (error) {
            console.error('Failed to create trading task:', error);
        }
    };

    const handleRowClick = (record: TradingTask) => {
        navigate(`/task-result/${record.taskId}`);
    };

    const columns: TableProps<TradingTask>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'taskId',
            key: 'taskId',
        },
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
                <Tag color={status === 'ACTIVE' ? 'green' : status === 'COMPLETED' ? 'blue' : 'red'}>
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
            render: (value) => value ? new Date(value).toLocaleString('uk-UA') : '-',
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
            title: 'проаналізовано',
            dataIndex: 'symbolsAnalyzed',
            key: 'symbolsAnalyzed',
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
            title: 'період',
            dataIndex: 'klinePeriod',
            key: 'klinePeriod',
            render: (_, a) => a.params?.klinePeriod
        },
        {
            title: 'Ліміт',
            dataIndex: 'orderLimit',
            key: 'orderLimit',
            render: (_, a) => a.params?.orderLimit || '-'
        },
        {
            title: 'Дії',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'ACTIVE' ? (
                        <Button
                            danger
                            onClick={(e) => {
                                e.stopPropagation();
                                stopTask(record.taskId)
                            }}
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
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Торгові завдання</h1>
                <Space>
                    <Button
                        type="primary"
                        onClick={() => setIsTradingModalOpen(true)}
                    >
                        Запустити трейдинг
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Створити нове завдання
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

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateAnalysisTask}
                isLoading={isAnalysisStarting}
            />
            <CreateTradingTaskModal
                isOpen={isTradingModalOpen}
                onClose={() => setIsTradingModalOpen(false)}
                onSubmit={handleCreateTradingTask}
                isLoading={isTradingStarting}
            />
        </div>
    );
};

export default Tasks;