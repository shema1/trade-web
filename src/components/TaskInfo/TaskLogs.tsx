import { List, Card, Table, Tag, Select, Space } from 'antd';
import type { TableProps } from 'antd';
import { useGetTaskLogsQuery } from '../../store/api/logs-data/logsApi';
import { Log } from '../../store/api/logs-data/logs-interface';
import { useState, useEffect } from 'react';

interface TaskLogsProps {
    taskId: string;
}

const { Option } = Select;

const LOG_TYPES = {
    INFO: { color: 'blue', label: 'Інформація' },
    WARNING: { color: 'orange', label: 'Попередження' },
    ERROR: { color: 'red', label: 'Помилка' },
    SUCCESS: { color: 'green', label: 'Успіх' },
};

const TaskLogs: React.FC<TaskLogsProps> = ({ taskId }) => {
    const [selectedType, setSelectedType] = useState<string | 'ALL'>('ALL');
    const { data: logs = [], isLoading } = useGetTaskLogsQuery(taskId);

    useEffect(() => {
        console.log('logs', logs);
    }, [logs]);

    const columns: TableProps<Log>['columns'] = [
        {
            title: 'Час',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp) => new Date(timestamp).toLocaleString('uk-UA'),
            sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
            defaultSortOrder: 'descend',
        },
        {
            title: 'Тип',
            dataIndex: 'level',
            key: 'level',
            render: (level) => (
                <Tag color={LOG_TYPES[level]?.color || 'default'}>
                    {LOG_TYPES[level]?.label || level}
                </Tag>
            ),
            filters: Object.entries(LOG_TYPES).map(([value, { label }]) => ({
                text: label,
                value,
            })),
            onFilter: (value, record) => record.type === value,
        },
        {
            title: 'Повідомлення',
            dataIndex: 'message',
            key: 'message',
            width: '50%',
        },
        {
            title: 'Деталі',
            dataIndex: 'details',
            key: 'details',
            render: (details) => {
                if (typeof details === 'object') {
                    return <pre>{JSON.stringify(details, null, 2)}</pre>;
                }
                return details;
            },
        },
    ];

    const filteredLogs = selectedType === 'ALL' 
        ? logs 
        : logs.filter(log => log.type === selectedType);

    return (
        <Card>
            <Space style={{ marginBottom: 16 }}>
                <Select 
                    defaultValue="ALL" 
                    style={{ width: 200 }} 
                    onChange={setSelectedType}
                >
                    <Option value="ALL">Всі типи</Option>
                    {Object.entries(LOG_TYPES).map(([value, { label }]) => (
                        <Option key={value} value={value}>
                            {label}
                        </Option>
                    ))}
                </Select>
            </Space>

            <Table<Log>
                dataSource={filteredLogs}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
                pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
                expandable={{
                    expandedRowRender: (record) => (
                        <pre style={{ margin: 0 }}>
                            {JSON.stringify(record.details, null, 2)}
                        </pre>
                    ),
                    rowExpandable: (record) => !!record.details,
                }}
            />
        </Card>
    );
};

export default TaskLogs; 