import { useEffect } from 'react';
import { useStartAnalyzingMutation, useGetRecommendationsQuery, useDeleteRecommendationMutation } from '../store/api/tradeRecommendation/tradeRecommendationApi';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { CreateRecommendationDto } from '../store/api/tradeRecommendation/interfaces';
import { useGetFuturesSymbolsQuery } from '../store/api/bybit/bybitApi';

const TradeRecommendation = () => {
  const { data, isLoading } = useGetRecommendationsQuery();
  const [startAnalyzing] = useStartAnalyzingMutation();
  const [deleteRecommendation] = useDeleteRecommendationMutation();
  const { data: symbols, isLoading: isSymbolsLoading } = useGetFuturesSymbolsQuery();


  useEffect(() => {
    console.log(symbols);
    if(symbols && symbols?.length > 0){
        const symbolsArray = symbols.map((symbol) => symbol.symbol);
        console.log("symbolsArray", symbolsArray)
        // startAnalyzing({ symbols: symbolsArray });
    }
  }, [symbols]);
  
  const columns: TableProps<CreateRecommendationDto>['columns'] = [
    {
      title: 'Час',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (value) => new Date(value).toLocaleString('uk-UA'),
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    },
    {
      title: 'Символ',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Таймфрейм',
      dataIndex: 'timeframe',
      key: 'timeframe',
    },
    {
      title: 'Рекомендація',
      dataIndex: 'recommendation',
      key: 'recommendation',
    },
    {
      title: 'lastPrice',
      dataIndex: 'lastPrice',
      key: 'lastPrice',
    },
    {
      title: 'Long Probability',
      dataIndex: 'longProbability',
      key: 'longProbability',
      sorter: (a, b) => Number(a.longProbability) - Number(b.longProbability),
    },
    {
      title: 'Short Probability',
      dataIndex: 'shortProbability',
      key: 'shortProbability',
      sorter: (a, b) => Number(a.shortProbability) - Number(b.shortProbability),
    }
  ];

  return (
    <div>
      <h1>TradeRecommendation</h1>
      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        <Table<CreateRecommendationDto>
          dataSource={data || []}
          columns={columns}
          rowKey="_id"
        />
      )}
    </div>
  );
};

export default TradeRecommendation;