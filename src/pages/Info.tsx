import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Select, Spin, Card } from 'antd';
import { 
  useGetFuturesSymbolsQuery, 
  useGetOpenInterestQuery,
  useGetTickersQuery,
  useGetKlineDataQuery
} from '../store/api/bybit/bybitApi';
import { OpenInterestAnalysis } from '../services/analysis/OpenInterestAnalysis';

interface PriceData {
  pair: string;
  price: {
    s: string;
    b: string[][];
    a: string[][];
    ts: number;
    u: number;
  };
  timestamp: string;
}

interface Symbol {
  symbol: string;
  baseCoin: string;
  quoteCoin: string;
  status: string;
}

const Info = () => {
  const [socket, setSocket] = useState<any>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [selectedPair, setSelectedPair] = useState<string>('BTCUSDT');
  
  // Запити для аналізу
  const { data: symbols, isLoading: isLoadingSymbols } = useGetFuturesSymbolsQuery();
  const { data: openInterest, isLoading: isLoadingOI } = useGetOpenInterestQuery({
    symbol: selectedPair,
    intervalTime: '5min'
  });
  const { data: ticker, isLoading: isLoadingTicker } = useGetTickersQuery({
    symbol: selectedPair
  });
  const { data: klineData, isLoading: isLoadingKline } = useGetKlineDataQuery({
    symbol: selectedPair,
    interval: '1',
    limit: 100
  });

  useEffect(() => {
    if (!selectedPair) return;

    // Підключення до веб-сокет сервера
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    // Встановлення з'єднання
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('subscribePair', selectedPair);
    });

    // Отримання оновлень цін
    newSocket.on(`pairUpdate:${selectedPair}`, (data: PriceData) => {
      console.log('Received price update:', data);
      setPriceData(data);
    });

    // Обробка помилок
    newSocket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);

    // Очищення при розмонтуванні компонента або зміні пари
    return () => {
      if (newSocket) {
        newSocket.emit('unsubscribePair', selectedPair);
        newSocket.disconnect();
      }
    };
  }, [selectedPair]);

  const handlePairChange = (value: string) => {
    setSelectedPair(value);
  };

  // Отримання аналізу
  const getAnalysis = () => {
    if (!openInterest || !ticker || !klineData || 
        isLoadingOI || isLoadingTicker || isLoadingKline) {
      return null;
    }

    return OpenInterestAnalysis.analyze(openInterest, ticker, klineData, 1);
  };

  const analysis = getAnalysis();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Аналіз Bybit</h2>
      
      <div className="mb-4">
        <Select
          loading={isLoadingSymbols}
          style={{ width: 200 }}
          value={selectedPair}
          onChange={handlePairChange}
          options={symbols?.map((symbol) => ({
            value: symbol.symbol,
            label: `${symbol.baseCoin}/${symbol.quoteCoin}`,
          }))}
          placeholder="Оберіть торгову пару"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Картка з аналізом Open Interest */}
        <Card title="Аналіз Open Interest" className="mb-4">
          {isLoadingOI || isLoadingTicker || isLoadingKline ? (
            <Spin />
          ) : analysis ? (
            <div>
              <div className="flex justify-between mb-2">
                <span>Ймовірність росту:</span>
                <span className={analysis.bullishProbability > 50 ? 'text-green-600' : 'text-gray-600'}>
                  {analysis.bullishProbability}%
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Ймовірність падіння:</span>
                <span className={analysis.bearishProbability > 50 ? 'text-red-600' : 'text-gray-600'}>
                  {analysis.bearishProbability}%
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Впевненість:</span>
                <span>{analysis.confidence}%</span>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-sm">{analysis.analysis}</p>
              </div>
            </div>
          ) : (
            <p>Помилка отримання даних</p>
          )}
        </Card>

        {/* Існуюча картка з ордербуком */}
        <Card title="Ордербук" className="mb-4">
          {isLoadingSymbols ? (
            <Spin />
          ) : priceData ? (
            <div>
              <p>Час оновлення: {new Date(priceData.timestamp).toLocaleString()}</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <h4 className="text-green-600">Біди (Покупка):</h4>
                  <ul>
                    {priceData.price.b.slice(0, 5).map((bid, index) => (
                      <li key={index}>
                        Ціна: {bid[0]}, Кількість: {bid[1]}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-600">Аски (Продаж):</h4>
                  <ul>
                    {priceData.price.a.slice(0, 5).map((ask, index) => (
                      <li key={index}>
                        Ціна: {ask[0]}, Кількість: {ask[1]}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p>Завантаження даних...</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Info;
    