'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
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
};

///////////////////////////////////////
//https://restcountries.com/v3.1/all
//#region ------ Lecture 248 First AJAX call -----
/*
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
getCountryData('canada');

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
*/
//#endregion

//#region ------ Lecture 250 Callback hell -----

/*
const getCountryAndNeighbor = function (country) {
  //AJAX call country 1
  const request = new XMLHttpRequest(); //oldschool way
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    // console.log(data);
    //render country 1
    renderCountry(data);

    //get neighbour country (2)
    const [neighbour] = data.borders;

    if (!neighbour) return;
    //AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      const [data2] = JSON.parse(this.responseText);
      console.log(data2);

      renderCountry(data2, 'neighbour');
    });
  });
};
*/
// getCountryAndNeighbor('gb');
/*
//callback hell
setTimeout(() => {
  console.log('1 sec passed');
  setTimeout(() => {
    console.log('2 sec passed');
    setTimeout(() => {
      console.log('3 sec passed');
      setTimeout(() => {
        console.log('4 sec passed');
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);
*/
//#endregion

//#region ------ Lecture 251-254 Promises and the Fetch API / chaining promises / errors handling (rejected promises) -----

// const request = new XMLHttpRequest(); //oldschool way
// request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
// request.send();
/*
const getCountryData = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      renderCountry(data[0]);
    });
};
*/

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

/*
const getCountryData_BeforeStructuring = function (country) {
  //country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
      console.log(response);

      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);
      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      if (!neighbour) return;
      //country 2
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then(response => {
      console.log(response);

      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);
      return response.json();
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.error(`${err} ⛔⛔⛔`);
      renderError(`Something went wrong ⛔⛔⛔ ${err.message}. Try again`);
    });
};
*/

const getCountryData = function (country) {
  //country 1
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];

      if (!neighbour) {
        throw new Error('No neighbour found!');
      }

      //country 2
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.error(`${err} ⛔⛔⛔`);
      renderError(`Something went wrong ⛔⛔⛔ ${err.message}. Try again`);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};

btn.addEventListener('click', function () {
  // getCountryData('canada');
  // getCountryData('australia');
});

// getCountryData('sadasd');

//#endregion

//#region ------ Codding challenge #1 -----

// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/
/*
const whereAmI = function (lat, lon) {
  const apiKey = '1c64d37ff00449108d5d98dce7ad89ea';
  const requestOptions = {
    method: 'GET',
  };
  fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`,
    requestOptions
  )
    .then(response => {
      if (!response.ok) throw new Error('Too many attempts');

      return response.json();
    })
    .then(data => {
      const location = data.features[0].properties;
      console.log(`You are in ${location.city}, ${location.country}`);
      getCountryData(`${location.country}`);
    })
    .catch(error => console.error(error));
};

whereAmI(52.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);
*/
//#endregion

//#region ------ Lecture 258 event loop -----
/*
console.log('Test Start'); // 1 (top level code)
setTimeout(() => console.log('0 sec timer', 0)); // 4 callback stack
Promise.resolve('Resolved Promise 1').then(res => console.log(res)); // 3 (microtasks stack has priority)
console.log('Test end'); // 2 (top level code)

Promise.resolve('Resolved Promise 2').then(res => {
  // for (let i = 0; i < 2000000000; i++) {}
  console.log(res);
});
*/
//#endregion

//#region ------ Lecture 259 building a simple promise -----
/*
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening 🔮');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You WIN 🤑');
    } else {
      reject(new Error('You lost your money 💩'));
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

//promisify setTimeout
const wait = function (second) {
  return new Promise(function (resolve) {
    setTimeout(resolve, second * 1000);
  });
};
wait(2).then(() => {
  console.log('Waited 2 sec');
  return wait(1).then(() => console.log('Waited 3 sec'));
});

Promise.resolve('ABC1').then(a => console.log(a));
Promise.reject(new Error('Problem')).catch(a => console.error(a));
*/
//#endregion

//#region ------ Lecture 260 promysifying the geolocation API -----
/*
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = function () {
  const apiKey = '1c64d37ff00449108d5d98dce7ad89ea';
  const requestOptions = {
    method: 'GET',
  };

  getPosition()
    .then(pos => {
      console.log(pos);
      const { latitude: lat, longitude: lon } = pos.coords;
      return fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`,
        requestOptions
      );
    })
    .then(response => {
      if (!response.ok) throw new Error('Too many attempts');

      return response.json();
    })
    .then(data => {
      const location = data.features[0].properties;
      console.log(`You are in ${location.city}, ${location.country}`);
      getCountryData(`${location.country}`);
    })
    .catch(error => console.error(error));
};

btn.addEventListener('click', whereAmI);
*/
//#endregion

//#region ------ Challenge 2 -----
// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Consume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
*/
/*
const images = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;

    img.addEventListener('load', function () {
      images.append(img);
      resolve(img);
    });
    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

const wait = function (second) {
  return new Promise(function (resolve) {
    setTimeout(resolve, second * 1000);
  });
};

let currentImgNo = 1;

const renderImages = function () {
  createImage(`img/img-${currentImgNo}.jpg`)
    .then(img => {
      wait(2).then(function () {
        console.log('Time is passed');
        img.style.display = 'none';
        currentImgNo++;
        renderImages();
      });
    })
    .catch(err => {
      console.error(err);
    });
};

renderImages();
*/
//#endregion

//#region ------ Lecture 262-266 Consuming promises with Async/Await, Try/catch -----
/*
const apiKey = '1c64d37ff00449108d5d98dce7ad89ea';
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lon } = pos.coords;
    const resGeo = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`
    );
    if (!resGeo.ok) throw new Error('Problem location data');
    const dataGeo = await resGeo.json();
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.features[0].properties.country}`
    );
    if (!res.ok) throw new Error('Problem getting country');

    const data = await res.json();
    renderCountry(data[0]);

    return `You are in ${dataGeo.features[0].properties.city}, ${dataGeo.features[0].properties.country}`;
  } catch (err) {
    console.error(err);
    renderError(`💩${err.message}`);

    //reject promise returned from async function
    throw err;
  }
};

// try {
//   let y = 1;
//   const x = 2;
//   x = 3;
// } catch (err) {
//   alert(err.message);
// }

console.log('1: Will Get location');
// whereAmI()
//   .then(city => console.log(`2: ${city}`))
//   .catch(err => console.error(`2: ${err.message} 💩`))
//   .finally(() => console.log('3: Finished Get location'));

(async function () {
  try {
    const city = await whereAmI();
    await console.log(`2: ${city}`);
  } catch (err) {
    console.error(`2: ${err.message} 💩`);
  }
  console.log('3: Finished Get location');
})();

const get3Countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);

    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);

    console.log(data.map(d => d[0].capital));
  } catch (err) {
    console.error(err);
  }
};

get3Countries('portugal', 'canada', 'tanzania');

//Promise.race
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/italy`),
    getJSON(`https://restcountries.com/v3.1/name/egypt`),
    getJSON(`https://restcountries.com/v3.1/name/mexico`),
  ]);
  console.log(res[0]);
})();

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error('Request took too long!'));
    }, sec * 1000);
  });
};

Promise.race([getJSON(`https://restcountries.com/v3.1/name/egypt`), timeout(1)])
  .then(res => console.log(res[0]))
  .catch(err => console.error(err));

//Promise.allSettled
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another success'),
]).then(res => console.log(res));

Promise.all([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));

//promise.any [ES2021]
Promise.any([
  Promise.resolve('Another success'),
  Promise.resolve('Success'),
  Promise.reject('Error'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));
  */
//#endregion

//#region ------ Challenge 3 -----

// Coding Challenge #3

/* 
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await (only the part where the promise is consumed). Compare the two versions, think about the big differences, and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'paralell' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.

GOOD LUCK 😀
*/

const images = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;

    img.addEventListener('load', function () {
      images.append(img);
      resolve(img);
    });
    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

const wait = function (second) {
  return new Promise(function (resolve) {
    setTimeout(resolve, second * 1000);
  });
};

const loadNPause = async function () {
  try {
    let img = await createImage(`img/img-1.jpg`);
    await wait(2);
    img.style.display = 'none';

    img = await createImage(`img/img-2.jpg`);
    await wait(2);
    img.style.display = 'none';

    img = await createImage(`img/img-3.jpg`);
    await wait(2);
    img.style.display = 'none';
  } catch (err) {
    console.error(err);
  }
};

const loadAll = async function (imgArr) {
  try {
    const imgs = await Promise.all(imgArr.map(async i => await createImage(i)));
    imgs.forEach(img => img.classList.add('parallel'));
    console.log(imgs);
  } catch (err) {
    console.error(err);
  }
};

console.log(loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']));
// loadNPause();

// createImage(`img/img-1.jpg`)
//   .then(img => {
//     currentImg = img;
//   })
//   .then(() => wait(2))
//   .then(() => (currentImg.style.display = 'none'))
//   .catch(err => {
//     console.error(err);
//   })
//   .then(() => {
//     createImage(`img/img-2.jpg`)
//       .then(img => {
//         currentImg = img;
//       })
//       .then(() => wait(2))
//       .then(() => (currentImg.style.display = 'none'))
//       .catch(err => {
//         console.error(err);
//       });
//   });

//#endregion
