import { List, Card } from 'antd';
import { useEffect, useState } from 'react';

interface TaskLogsProps {
    taskId: string;
}

const TaskLogs: React.FC<TaskLogsProps> = ({ taskId }) => {
    // Тут можна додати логіку для отримання логів
    return (
        <Card>
            <List
                itemLayout="horizontal"
                dataSource={[]} // Тут будуть логи
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            title={item.timestamp}
                            description={item.message}
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default TaskLogs; 