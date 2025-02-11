'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCarMakes } from './api/fetchData';

export default function Home() {
  const [data, setData] = useState(null);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);  

  console.log(data && data)

  useEffect(() => {
    const loadCarMakes = async () => {
      try {
        const result = await fetchCarMakes();
        setData(result); 
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false); 
      }
    };

    loadCarMakes();
  }, []);

 
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2015 + 1 }, (_, index) => 2015 + index);
  
  const handleMakeChange = (event) => {
    setSelectedMake(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="min-h-screen bg-beige flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Cars Title</h1>

      <div className="flex w-full max-w-4xl justify-between">
        <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg w-1/3">
          <label htmlFor="make" className="mb-2 text-lg font-medium">Choose type:</label>
          <select 
            id="make" 
            className="p-2 border rounded w-full box-border" 
            value={selectedMake} 
            onChange={handleMakeChange}
            disabled={loading} 
          >
            <option value="" disabled>Select Make</option>
            {data ? (
              data.Results.map(make => (
                <option key={make.MakeId} value={make.MakeId}>
                  {make.MakeName}
                </option>
              ))
            ) : (
              <option>Loading...</option> 
            )}
          </select>
        </div>

        <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg w-1/3">
          <label htmlFor="year" className="mb-2 text-lg font-medium">Choose model year:</label>
          <select 
            id="year" 
            className="p-2 border rounded w-full box-border" 
            value={selectedYear} 
            onChange={handleYearChange}
          >
            <option value="" disabled>Select Year</option>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <Link 
        href={selectedMake && selectedYear ? `pages/result/${selectedMake}/${selectedYear}` : '#'} 
        className={`mt-20 ${selectedMake && selectedYear ? 'bg-blue-500' : 'bg-gray-500'} text-white py-2 px-6 rounded-lg`} 
        style={{ pointerEvents: selectedMake && selectedYear ? 'auto' : 'none' }}
      >
        Next
      </Link>
    </div>
  );
}
