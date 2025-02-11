'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const fetchModelsForMakeAndYear = async (makeId, year) => {
  const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`);
  const data = await response.json();
  return data.Results || [];  
};

const ModelsList = ({ makeId, year }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (makeId && year) {
      const fetchModels = async () => {
        try {
          setLoading(true);  
          const result = await fetchModelsForMakeAndYear(makeId, year);  
          setModels(result);  
        } catch (err) {
          setError('Error fetching data');  
        } finally {
          setLoading(false);  
        }
      };
      fetchModels();  
    }
  }, [makeId, year]);  

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
  const { makeId, year } = useParams();  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8">Results for {makeId} - {year}</h1>
      
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

export default ResultPage;
