import './css/styles.css';
import { Notify } from 'notiflix';
import { PixabayApi } from './js/fetchPhotos';
import { createPhotosCardMarkup } from './js/createMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.button-load'),
  galleryEl: document.querySelector('.gallery'),
};

const pixabayApi = new PixabayApi();

refs.searchForm.addEventListener('submit', handleSearchFormSubmit);

async function handleSearchFormSubmit(event) {
  event.preventDefault();
  clearSearchForm();

  const searchQuerry = event.currentTarget.elements['searchQuery'].value;
  pixabayApi.query = searchQuerry.trim();

  if (!searchQuerry) {
    Notify.failure('Please write anything.');
    return;
  }

  try {
    pixabayApi.page = 1;
    const { data } = await pixabayApi.fetchPhotos();

    if (!data.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    refs.galleryEl.insertAdjacentHTML(
      'beforeend',
      createPhotosCardMarkup(data.hits)
    );
    refs.loadMoreBtn.classList.remove('is-hidden');

    const totalHits = data.totalHits;

    Notify.success(`Hooray! We found ${totalHits} images.`);

    if (
      refs.galleryEl.querySelectorAll('.photo-card').length >= data.totalHits
    ) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (err) {
    console.log(err);
  }
}

refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);

async function handleLoadMoreBtnClick(event) {
  pixabayApi.page += 1;

  try {
    const { data } = await pixabayApi.fetchPhotos();

    if (pixabayApi.page === data.total) {
      refs.loadMoreBtn.classList.add('is-hidden');
    }
    refs.galleryEl.insertAdjacentHTML(
      'beforeend',
      createPhotosCardMarkup(data.hits)
    );
  } catch (err) {
    console.log(err);
  }
}

const gallery = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  docClose: true,
});

function clearSearchForm() {
  refs.galleryEl.innerHTML = '';
}
