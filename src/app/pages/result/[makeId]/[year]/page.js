'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Функция для получения данных моделей
const fetchModelsForMakeAndYear = async (makeId, year) => {
  const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`);
  const data = await response.json();
  return data.Results || [];  // Возвращаем данные моделей или пустой массив.
};

// Компонент, который будет асинхронно загружать данные
const ModelsList = ({ makeId, year }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (makeId && year) {
      const fetchModels = async () => {
        try {
          setLoading(true);  // Начинаем загрузку
          const result = await fetchModelsForMakeAndYear(makeId, year);  // Получаем модели
          setModels(result);  // Обновляем состояние с моделями
        } catch (err) {
          setError('Error fetching data');  // Обрабатываем ошибки
        } finally {
          setLoading(false);  // Завершаем загрузку
        }
      };
      fetchModels();  // Вызываем функцию для получения данных
    }
  }, [makeId, year]);  // Повторяем запрос при изменении makeId или year

  if (loading) return <div className="text-center">Loading models...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
      {models.length ? (
        <ul>
          {models.map((model) => (
            <li key={model.Model_Name} className="py-2 px-4 border-b border-gray-300 hover:bg-gray-100 rounded-md">
              {model.Model_Name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-xl text-gray-500">No models found.</p>
      )}
    </div>
  );
};

const ResultPage = () => {
  const { makeId, year } = useParams();  // Получаем параметры из URL

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8">Results for {makeId} - {year}</h1>

      {/* Оборачиваем ModelsList в Suspense */}
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <ModelsList makeId={makeId} year={year} />
      </Suspense>

      <div className="mt-8">
        <Link 
          href="/" 
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

// Экспорт компонента как default
export default ResultPage;
