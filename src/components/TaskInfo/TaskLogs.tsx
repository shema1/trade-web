import { Card, Table, Tag, Select, Space } from 'antd';
import type { TableProps } from 'antd';
import { useGetTaskLogsQuery } from '../../store/api/logs-data/logsApi';
import { Log, LogLevel } from '../../store/api/logs-data/logs-interface';
import { useState } from 'react';

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
    const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);

    const { data, isLoading } = useGetTaskLogsQuery({
        taskId,
        level: selectedLevel !== 'ALL' ? selectedLevel as LogLevel : undefined,
        page: currentPage,
        limit: pageSize,
        sortBy: 'timestamp',
        sortOrder: 'desc',
    });

    const columns: TableProps<Log>['columns'] = [
        {
            title: 'Час',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp) => new Date(timestamp).toLocaleString('uk-UA'),
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
        },
        {
            title: 'Повідомлення',
            dataIndex: 'message',
            key: 'message',
            width: '50%',
        },
    ];

    return (
        <Card>
            <Space style={{ marginBottom: 16 }}>
                <Select 
                    defaultValue="ALL" 
                    style={{ width: 200 }} 
                    onChange={setSelectedLevel}
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
                dataSource={data?.items || []}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: data?.total || 0,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
                expandable={{
                    expandedRowRender: (record) => (
                        <pre style={{ margin: 0 }}>
                            {JSON.stringify(record.metadata, null, 2)}
                        </pre>
                    ),
                    rowExpandable: (record) => !!record.metadata,
                }}
            />
        </Card>
    );
};

export default TaskLogs; 