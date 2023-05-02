'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
//https://restcountries.com/v3.1/all

const getCountryData = function (country) {
  const request = new XMLHttpRequest(); //oldschool way
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    const html = `
  <article class="country">
          <img class="country__img" src="${data.flags.svg}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.official}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              Number(data.population) / 1000000
            ).toFixed(1)} m.</p>
            <p class="country__row"><span>🗣️</span>${
              Object.values(data.languages)[0]
            }</p>
            <p class="country__row"><span>💰</span>${
              Object.values(data.currencies)[0].name
            }</p>
          </div>
        </article>
  `;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};

getCountryData('ukraine');

const getAnimeData = function (id) {
  const request = new XMLHttpRequest(); //oldschool way
  request.open('GET', `https://api.jikan.moe/v4/anime/${id}/full`);
  request.send();

  request.addEventListener('load', function () {
    const { data } = JSON.parse(this.responseText);
    console.log(data);
    const html = `
    <article class="country">
            <img class="country__img" src="${
              Object.values(data.images)[1].image_url
            }" />
            <div class="country__data">
              <h3 class="country__name">${data.title}</h3>
              <h4 class="country__region">${data.synopsis.slice(0, 150)}...</h4>
              <p class="country__row"><span>🌐</span>${data.year}</p>
              <p class="country__row"><span>🎥</span>${data.episodes}</p>
              <p class="country__row"><span>⭐</span>${data.score}</p>
            </div>
          </article>
    `;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};
getAnimeData(20);
