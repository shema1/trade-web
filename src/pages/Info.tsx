import { useEffect, useState } from 'react';
import io from 'socket.io-client';

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

const Info = () => {
  const [socket, setSocket] = useState<any>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const PAIR = 'BTCUSDT'; // Приклад пари для підписки

  useEffect(() => {
    // Підключення до веб-сокет сервера
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    // Встановлення з'єднання
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      // Підписка на оновлення цін для конкретної пари
      newSocket.emit('subscribePair', PAIR);
    });

    // Отримання оновлень цін
    newSocket.on(`pairUpdate:${PAIR}`, (data: PriceData) => {
      console.log('Received price update:', data);
      setPriceData(data);
    });

    // Обробка помилок
    newSocket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);

    // Очищення при розмонтуванні компонента
    return () => {
      if (newSocket) {
        newSocket.emit('unsubscribePair', PAIR);
        newSocket.disconnect();
      }
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ціни Bybit</h2>
      {priceData ? (
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
    