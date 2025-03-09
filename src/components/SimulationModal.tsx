import { Modal, Form, InputNumber, Button } from 'antd';
import { useLazyTradingSimulationQuery } from '../store/api/trading/tradingApi';
import { TradingTaskSimulationRequest } from '../store/api/trading/tradingInterface';

interface SimulationModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: string;
}

const SimulationModal = ({ isOpen, onClose, taskId }: SimulationModalProps) => {
    const [form] = Form.useForm();
    const [checkProfit, { data: simulationResult, isLoading }] = useLazyTradingSimulationQuery();

    const handleSubmit = async (values: TradingTaskSimulationRequest) => {
        try {
            const request: TradingTaskSimulationRequest = {
                ...values,
                taskId,
            };
            await checkProfit(request);
        } catch (error) {
            console.error('Помилка при перевірці профіту:', error);
        }
    };

    return (
        <Modal
            title="Перевірка профіту"
            open={isOpen}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                initialValues={{
                    betSize: 5.5,
                    stopLoss: 0.5,
                    takeProfit: 0.5,
                    interval: 300   
                }}
            >


                <Form.Item
                    label="Розмір ставки "
                    name="betSize"
                    rules={[{ required: true, message: 'Вкажіть розмір ставки' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={1}
                        max={100}
                        step={0.1}
                    />
                </Form.Item>

                <Form.Item
                    label="Стоп-лосс (%)"
                    name="stopLoss"
                    rules={[{ required: true, message: 'Вкажіть стоп-лосс' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0.1}
                        max={100}
                        step={0.1}
                    />
                </Form.Item>

                <Form.Item
                    label="Тейк-профіт (%)"
                    name="takeProfit"
                    rules={[{ required: true, message: 'Вкажіть тейк-профіт' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0.1}
                        max={100}
                        step={0.1}
                    />
                </Form.Item>

                <Form.Item
                    label="Інтервал"
                    name="interval"
                    rules={[{ required: true, message: 'Вкажіть інтервал' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={200}
                        max={1000}
                        step={100}
                    />
                </Form.Item>

                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={isLoading}
                        block
                    >
                        Перевірити
                    </Button>
                </Form.Item>
            </Form>

            {simulationResult && (
                <div>
                    <h3>Результати симуляції:</h3>
                    <p>Прибуток: {simulationResult.result.profit.toFixed(2)}</p>
                    <p>Успішність: {simulationResult.result.successRate}%</p>
                    <p>Всього угод: {simulationResult.result.total}</p>
                    <p>Прибуткових: {simulationResult.result.profitable}</p>
                    <p>Збиткових: {simulationResult.result.unprofitable}</p>
                </div>
            )}
        </Modal>
    );
};

export default SimulationModal; 