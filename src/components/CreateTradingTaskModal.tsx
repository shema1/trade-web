import { Modal, Form, Select, InputNumber } from 'antd';
import { CreateTradingTaskDto } from '../store/api/trading-tasks/trading-tasks-Interface';

interface CreateTradingTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateTradingTaskDto) => void;
  isLoading: boolean;
}

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

const CreateTradingTaskModal: React.FC<CreateTradingTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        keepActive: true,
        testMode: false,
      });
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Створення торгового завдання"
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
          timeframe: '60',
          maxIterations: 9999999,
          orderLimit: 10,
          betSize: 5,
          stopLoss: 2,
          takeProfit: 2,
        }}
      >
        <Form.Item
          name="timeframe"
          label="Часовий інтервал"
          rules={[{ required: true, message: 'Виберіть часовий інтервал' }]}
        >
          <Select options={timeframeOptions} />
        </Form.Item>

        <Form.Item
          name="maxIterations"
          label="Максимальна кількість ітерацій"
          rules={[{ required: true, message: 'Введіть максимальну кількість ітерацій' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="orderLimit"
          label="Ліміт ордерів"
          rules={[{ required: true, message: 'Введіть ліміт ордерів' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="betSize"
          label="Розмір ставки (USDT)"
          rules={[{ required: true, message: 'Введіть розмір ставки' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="stopLoss"
          label="Стоп-лосс (%)"
          rules={[{ required: true, message: 'Введіть стоп-лосс' }]}
        >
          <InputNumber min={0.1} max={100} step={0.1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="takeProfit"
          label="Тейк-профіт (%)"
          rules={[{ required: true, message: 'Введіть тейк-профіт' }]}
        >
          <InputNumber min={0.1} max={100} step={0.1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTradingTaskModal; 