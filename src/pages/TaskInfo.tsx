import { useParams } from 'react-router-dom';
import { Card, Tabs, Statistic, Row, Col, Tag, Spin } from 'antd';
import { useGetTaskByIdQuery } from '../store/api/trading-tasks/trading-tasksApi';
import OrdersInfo from '../components/TaskInfo/OrdersInfo';
import { TradingTaskStatus } from '../store/api/trading-tasks/trading-tasks-Interface';
import TaskLogs from '../components/TaskInfo/TaskLogs';
import TaskStatistics from '../components/TaskInfo/TaskStatistics';

const { TabPane } = Tabs;

const getStatusColor = (status: TradingTaskStatus) => {
    switch (status) {
        case TradingTaskStatus.ACTIVE:
            return 'green';
        case TradingTaskStatus.COMPLETED:
            return 'blue';
        case TradingTaskStatus.ERROR:
            return 'red';
        case TradingTaskStatus.PENDING:
            return 'orange';
        default:
            return 'default';
    }
};

const TaskInfo = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const { data: task, isLoading } = useGetTaskByIdQuery(taskId || '');

    if (isLoading) {
        return <Spin size="large" />;
    }

    if (!task) {
        return <div>Завдання не знайдено</div>;
    }

    return (
        <div>
            <Card>
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Statistic 
                            title="Статус" 
                            value={task.status} 
                            prefix={<Tag color={getStatusColor(task.status)}>{task.status}</Tag>} 
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic 
                            title="Ітерацій" 
                            value={task.iterationCount} 
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic 
                            title="Активних ордерів" 
                            value={task.activeOrders.length} 
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic 
                            title="Завершених ордерів" 
                            value={task.completedOrders.length} 
                        />
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col span={8}>
                        <Card size="small" title="Параметри торгівлі">
                            <p>Таймфрейм: {task.params.timeframe}</p>
                            <p>Розмір ставки: {task.params.betSize} USDT</p>
                            <p>Стоп-лосс: {task.params.stopLoss}%</p>
                            <p>Тейк-профіт: {task.params.takeProfit}%</p>
                            <p>Ліміт ордерів: {task.params.orderLimit}</p>
                        </Card>
                    </Col>
                    <Col span={16}>
                        <TaskStatistics task={task} />
                    </Col>
                </Row>
            </Card>

            <Card style={{ marginTop: 16 }}>
                <Tabs defaultActiveKey="orders">
                    <TabPane tab="Інформація про ордери" key="orders">
                        <OrdersInfo 
                            activeOrders={task.activeOrders}
                            completedOrders={task.completedOrders}
                        />
                    </TabPane>
                    <TabPane tab="Логи" key="logs">
                        <TaskLogs taskId={task._id} />
                    </TabPane>
                    <TabPane tab="Аналіз" key="analysis">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card title="Прибуткові сигнали">
                                    <ul>
                                        {task.analysisResultsProfit.map((result, index) => (
                                            <li key={index}>
                                                {result.symbol}: {result.pnl.toFixed(2)} USDT
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Збиткові сигнали">
                                    <ul>
                                        {task.analysisResultsLoss.map((result, index) => (
                                            <li key={index}>
                                                {result.symbol}: {result.pnl.toFixed(2)} USDT
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default TaskInfo; 


