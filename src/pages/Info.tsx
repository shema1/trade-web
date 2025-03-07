import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Select, Spin } from 'antd';
import { useGetFuturesSymbolsQuery } from '../store/api/bybit/bybitApi';

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
  
  // Використовуємо RTK Query замість axios
  const { data: symbols, isLoading } = useGetFuturesSymbolsQuery();

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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ціни Bybit</h2>
      
      <div className="mb-4">
        <Select
          loading={isLoading}
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

      {isLoading ? (
        <Spin />
      ) : priceData ? (
        <div className="bg-white p-4 rounded shadow">
          <p>Пара: {priceData.pair}</p>
          <p>Час оновлення: {new Date(priceData.timestamp).toLocaleString()}</p>
          <div className="mt-2">
            <h3 className="font-semibold">Ордербук:</h3>
            <div className="grid grid-cols-2 gap-4">
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
        </div>
      ) : (
        <p>Завантаження даних...</p>
      )}
    </div>
  );
};

export default Info;
    