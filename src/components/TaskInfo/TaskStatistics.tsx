import { Card, Row, Col, Statistic } from 'antd';
import { TradingTask } from '../../store/api/trading-tasks/trading-tasks-Interface';

interface TaskStatisticsProps {
    task: TradingTask;
}

const TaskStatistics: React.FC<TaskStatisticsProps> = ({ task }) => {
    const totalPnl = task.completedOrders.reduce((sum, order) => sum + order.pnl, 0);
    const profitableOrders = task.completedOrders.filter(order => order.pnl > 0).length;
    const winRate = (profitableOrders / task.completedOrders.length) * 100 || 0;

    return (
        <Card title="Статистика">
            <Row gutter={16}>
                <Col span={8}>
                    <Statistic
                        title="Загальний P&L"
                        value={totalPnl}
                        precision={2}
                        suffix="USDT"
                        valueStyle={{ color: totalPnl >= 0 ? '#3f8600' : '#cf1322' }}
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="Прибуткові угоди"
                        value={profitableOrders}
                        suffix={`/ ${task.completedOrders.length}`}
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="Успішність"
                        value={winRate}
                        precision={2}
                        suffix="%"
                        valueStyle={{ color: winRate >= 50 ? '#3f8600' : '#cf1322' }}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default TaskStatistics; 