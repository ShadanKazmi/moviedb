import axios from "axios";

const API_KEY = '5c98b255';
const URL = 'http://www.omdbapi.com/';


export const getMovieByTitle = async (title) => {
    try {
      const response = await axios.get(URL, {
        params: {
          apikey: API_KEY,
          t: title,
        },
      });

      if (response.data.Response === 'True') {
        return response.data;
      } else {
        throw new Error(response.data.Error);
      }
    } catch (error) {
      console.error(`Error fetching movie: ${error.message}`);
      throw error;
    }
  };