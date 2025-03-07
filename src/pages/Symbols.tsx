import { Table, Typography, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useGetFuturesSymbolsQuery } from '../store/api/bybit/bybitApi';
import type { FuturesSymbolResponse } from '../store/api/bybit/Interfeces';
import { useState } from 'react';

const { Title } = Typography;
const { Search } = Input;

const Symbols = () => {
  const { data: symbols, isLoading } = useGetFuturesSymbolsQuery();
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(20);

  // Фільтруємо дані на основі пошукового запиту
  const filteredData = symbols?.filter(symbol => 
    symbol.symbol.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<FuturesSymbolResponse> = [
    {
      title: 'Торгова пара',
      dataIndex: 'symbol',
      key: 'symbol',
      sorter: (a, b) => a.symbol.localeCompare(b.symbol),
      render: (text) => <strong>{text}</strong>,
      fixed: 'left',
      width: 150,
    },
    {
      title: 'Поточна ціна',
      dataIndex: ['priceInfo', 'currentPrice'],
      key: 'currentPrice',
      sorter: (a, b) => Number(a.priceInfo.currentPrice) - Number(b.priceInfo.currentPrice),
      render: (price) => Number(price).toLocaleString('uk-UA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
      }),
      width: 150,
    },
    {
      title: 'Зміна за 24г',
      dataIndex: ['priceInfo', 'priceChange24h'],
      key: 'priceChange24h',
      sorter: (a, b) => a.priceInfo.priceChange24h - b.priceInfo.priceChange24h,
      render: (value) => {
        const color = value > 0 ? 'green' : value < 0 ? 'red' : 'gray';
        return (
          <span style={{ color }}>
            {value > 0 ? '+' : ''}{value.toFixed(2)}%
          </span>
        );
      },
      width: 150,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Фючерсні пари Bybit</Title>
        <Search
          placeholder="Пошук торгової пари..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={isLoading}
        rowKey="symbol"
        pagination={{
          current: 1,
          pageSize: pageSize,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          showQuickJumper: true,
          total: filteredData?.length,
          onShowSizeChange: (_, size) => setPageSize(size),
          showTotal: (total) => `Всього: ${total} пар`,
        }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default Symbols; 