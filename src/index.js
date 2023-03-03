import './css/styles.css';
// const debounce = require('lodash.debounce');
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries.js';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  if (!evt.target.value.trim()) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(evt.target.value.trim())
    .then(onFetch)
    .catch(err => {
      Notify.failure('Oops, there is no country with that name.');
      console.error(err);
    });
}

function onFetch(data) {
  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  createMurkup(data);
}

function createMurkup(countries) {
  if (countries.length > 1) {
    const countriesMarkup = countries
      .map(
        ({ name: { official }, flags }) =>
          `<li class="countries-item"><img src="${flags.svg}" alt="${flags.alt}" style="max-width:30px; max-height:30px"><p>${official}</p></li>`
      )
      .join('');
    countryInfo.innerHTML = '';
    countryList.innerHTML = countriesMarkup;

    return;
  }

  const {
    name: { official },
    capital,
    population,
    flags,
    languages,
  } = countries[0];
  const allLanguages = Object.values(languages).join(', ');
  const countryMarkup = `<div class="coutry-name"><img src="${flags.svg}" alt="${flags.alt}" style="max-width:30px; max-height:30px"><h2>${official}</h2></div><p><span style="font-weight:bold">Capital:</span> ${capital}</p><p><span style="font-weight:bold">Population:</span> ${population}</p><p><span style="font-weight:bold">Languages:</span> ${allLanguages}</p>`;
  countryList.innerHTML = '';
  countryInfo.innerHTML = countryMarkup;
}
