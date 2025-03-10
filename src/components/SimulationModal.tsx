import { Modal, Form, InputNumber, Select } from 'antd';
import { useTradingSimulationMutation } from '../store/api/trading/tradingApi';

interface SimulationModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: string;
}

const SimulationModal: React.FC<SimulationModalProps> = ({
    isOpen,
    onClose,
    taskId,
}) => {
    const [form] = Form.useForm();
    const [createSimulation, { isLoading }] = useTradingSimulationMutation();

    const timeframeOptions = [
        { label: '1 хвилина', value: '1' },
        { label: '3 хвилини', value: '3' },
        { label: '5 хвилин', value: '5' },
        { label: '15 хвилин', value: '15' },
        { label: '30 хвилин', value: '30' },
        { label: '1 година', value: '60' },
        { label: '2 години', value: '120' },
        { label: '4 години', value: '240' },
        { label: '6 годин', value: '360' },
        { label: '12 годин', value: '720' },
        { label: '1 день', value: 'D' },
        { label: '1 тиждень', value: 'W' },
        { label: '1 місяць', value: 'M' },
    ];

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await createSimulation({
                taskId,
                ...values,
            }).unwrap();
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Failed to create simulation:', error);
        }
    };

    return (
        <Modal
            title="Створення симуляції"
            open={isOpen}
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={isLoading}
            okText="Створити"
            cancelText="Скасувати"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    takeProfit: 1,
                    stopLoss: 0.5,
                    betSize: 100,
                    interval: '1',
                }}
            >
                <Form.Item
                    name="interval"
                    label="Часовий інтервал"
                    rules={[{ required: true }]}
                >
                    <Select options={timeframeOptions} />
                </Form.Item>
                <Form.Item
                    name="takeProfit"
                    label="Тейк-профіт (%)"
                    rules={[{ required: true }]}
                >
                    <InputNumber min={0.1} max={100} step={0.1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="stopLoss"
                    label="Стоп-лосс (%)"
                    rules={[{ required: true }]}
                >
                    <InputNumber min={0.1} max={100} step={0.1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="betSize"
                    label="Розмір ставки (USDT)"
                    rules={[{ required: true }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SimulationModal; 