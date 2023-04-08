import axios from 'axios';

export class PixabayApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '35210177-92e7d5da23c5a5f8bdce8ac7a';

  query = null;
  page = 1;

  async fetchPhotos() {
    try {
      return await axios.get(`${this.#BASE_URL}`, {
        params: {
          q: this.query,
          page: this.page,
          per_page: 40,
          image_type: this.photo,
          safeseafch: true,
          orientation: this.horizontal,
          key: this.#API_KEY,
        },
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
