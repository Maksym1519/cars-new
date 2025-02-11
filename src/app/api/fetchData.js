import axios from "axios";

export const fetchCarMakes = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_URL_MAKES;  
      console.log('Request URL:', url);  
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching car makes:', error);
      throw error; 
    }
  };
  
