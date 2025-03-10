import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { StartTradingRequest } from '../store/api/trading/tradingInterface';
import { useGetFuturesSymbolsQuery } from '../store/api/bybit/bybitApi';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: StartTradingRequest) => void;
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

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [form] = Form.useForm();
  const { data: symbols, isLoading: isSymbolsLoading } = useGetFuturesSymbolsQuery();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({ ...values, symbols: symbols?.map((symbol) => symbol.symbol) });
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Створення нового торгового завдання"
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      okText="Створити"
      cancelText="Скасувати"
      loading={isSymbolsLoading}  
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          timeframe: '1',
          klinePeriod: 1000,
          longProbabilityValue: 60,
          shortProbabilityValue: 60,
          maxIterations: 1,
        }}
      >
        {/* <Form.Item
          name="symbols"
          label="Торгові пари"
          rules={[{ required: true, message: 'Введіть торгові пари' }]}
          help="Введіть пари через кому (наприклад: BTCUSDT, ETHUSDT)"
        >
          <Input placeholder="BTCUSDT, ETHUSDT" />
        </Form.Item> */}

        <Form.Item
          name="timeframe"
          label="Часовий інтервал"
          rules={[{ required: true }]}
        >
          <Select options={timeframeOptions} />
        </Form.Item>

        <Form.Item
          name="klinePeriod"
          label="Кількість свічок"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={1000} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="longProbabilityValue"
          label="Мінімальна ймовірність для довгої позиції (%)"
          rules={[{ required: true }]}
        >
          <InputNumber min={50} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="shortProbabilityValue"
          label="Мінімальна ймовірність для короткої позиції (%)"
          rules={[{ required: true }]}
        >
          <InputNumber min={50} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="maxIterations"
          label="Максимальна кількість ітерацій"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal; 