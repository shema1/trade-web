import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { TradingTaskOrder, TradingTaskCompletedOrder } from '../../store/api/trading-tasks/trading-tasks-Interface';
import { useEffect } from 'react';

interface OrdersInfoProps {
    activeOrders: TradingTaskOrder[];
    completedOrders: TradingTaskCompletedOrder[];
}

const OrdersInfo: React.FC<OrdersInfoProps> = ({ activeOrders, completedOrders }) => {

    const columns: TableProps<TradingTaskCompletedOrder>['columns'] = [
        {
            title: 'Символ',
            dataIndex: ['analysisResult', 'symbol'],
            key: 'symbol',
        },
        {
            title: 'Сторона',
            dataIndex: ['analysisResult', 'recommendation'],
            key: 'side',
            render: (side) => (
                <Tag color={side === 'BUY' ? 'green' : 'red'}>
                    {side}
                </Tag>
            ),
        },
        {
            title: 'Ціна входу',
            dataIndex: ['order', 'price'],
            key: 'entryPrice',
        },
        {
            title: 'Реальний розмір ставки',
            dataIndex: 'order',
            key: 'order',
            render: (order) => {
                console.log("order", order);
                return <span>{Number(order.cumExecValue).toFixed(2)}</span>
            },
        },
        {
            title: 'Час створення',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString('uk-UA'),
        },
    ];

    const completedOrdersColumns: TableProps<TradingTaskCompletedOrder>['columns'] = [
        {
            title: 'Символ',
            dataIndex: ['analysisResult', 'symbol'],
            key: 'symbol',
        },
        {
            title: 'Сторона',
            dataIndex: ['analysisResult', 'recommendation'],
            key: 'side',
            render: (side) => (
                <Tag color={side === 'BUY' ? 'green' : 'red'}>
                    {side}
                </Tag>
            ),
        },
        {
            title: 'Ціна входу',
            dataIndex: ['order', 'price'],
            key: 'entryPrice',
        },
        {
            title: 'PnL',
            dataIndex: 'pnl',
            key: 'pnl',
            render: (pnl) => (
                <span style={{ color: pnl >= 0 ? 'green' : 'red' }}>
                    {pnl?.toFixed(2)} USDT
                </span>
            ),
        },
        {
            title: 'Час створення',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString('uk-UA'),
        },
    ];


    useEffect(() => {
        console.log('activeOrders', activeOrders);
    }, [activeOrders, completedOrders]);


    return (
        <div>
            <h3>Активні ордери ({activeOrders.length})</h3>
            <Table
                dataSource={activeOrders}
                columns={columns}
                rowKey="bybitOrderId"
            />

            <h3>Завершені ордери ({completedOrders.length})</h3>
            <Table
                dataSource={completedOrders}
                columns={completedOrdersColumns}
                rowKey="bybitOrderId"
            />
        </div>
    );
};

export default OrdersInfo; 