'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

//USING OLD SCHOOL Method
// const getCountryData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   console.log(request);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);
//     console.log(Object.values(data['currencies'])[0].name);
//     // console.log(data)

//     const html = `
//   <article class="country">
//     <img class="country__img" src="${data.flags['svg']}" />

//     <div class="country__data">
//       <h3 class="country__name">${data.altSpellings[2]}</h3>
//       <h4 class="country__region">${data.region}</h4>
//       <p class="country__row"><span>👫</span>${(
//         +data.population / 1000000
//       ).toFixed(1)} people</p>

//       <p class="country__row"><span>🗣️</span>${
//         Object.values(data['languages'])[0]
//       }</p>

//       <p class="country__row"><span>💰</span>${
//         Object.values(data['currencies'])[0].name
//       }</p>

//     </div>

//   </article>
//   `;
//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = 1;
//   });
// };

// getCountryData('india');
// getCountryData('usa');
// getCountryData('portugal');

// const getCountryAndNeighbour = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   console.log(request);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);
//     console.log(Object.values(data['currencies'])[0].name);
//     // console.log(data)
//     renderCountry(data);
//     //get first neinbour country
//     const neibour = data.borders?.[0];

//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.com/v3.1/alpha/${neibour}`);

//     request2.send();

//     request2.addEventListener('load', function () {
//       const [data] = JSON.parse(this.responseText);
//       // console.log(data);
//       renderCountry(data, 'neighbour');
//     });
//   });
// };

// getCountryAndNeighbour('india');
// getCountryAndNeighbour('nepal');

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags['svg']}" />

    <div class="country__data">
      <h3 class="country__name">${data.name['common']}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      
      <p class="country__row"><span>🗣️</span>${
        Object.values(data['languages'])[0]
      }</p>
      
      <p class="country__row"><span>💰</span>${
        Object.values(data['currencies'])[0].name
      }</p>
     
    </div>
    
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

// const req = fetch(`https://restcountries.com/v3.1/name/india`);
// console.log(req);

//implementing get country result using modern way--->(making ajax call using fetch)
// const getCountrydata = function (country) {
//   const request = fetch(`https://restcountries.com/v3.1/name/${country}`);
//   request
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};
//making use of arrow

// const getCountrydata = function (country) {
//   //country 1
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Country not found');
//       }
//       return response.json();
//     })
//     .then(data => {
//       renderCountry(data[0]);
//       const nbr = data[0].borders?.[0];
//       console.log(nbr);
//       if (!nbr) return;

//       //country2
//       return fetch(`https://restcountries.com/v3.1/alpha/${nbr}`);
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Country not found');
//       }
//       return response.json();
//     })
//     .then(data => renderCountry(data[0], 'neighbour'))
//     .catch(err => {
//       console.error(err);
//       renderError(`something went wrong..🤯🤯 ${err.message}`);
//     })
//     .finally((countriesContainer.style.opacity = 1));
// };

const getCountrydata = function (country) {
  //country 1
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      // console.log(data);
      renderCountry(data[0]);
      const nbr = data[0].borders?.[0];
      console.log(nbr);
      if (!nbr) {
        throw new Error('Neighbour not found');
      }

      //country2
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${nbr}`,
        'Country not found'
      );
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.error(err);
      renderError(`something went wrong..🤯🤯 ${err.message}`);
    })
    .finally((countriesContainer.style.opacity = 1));
};

btn.addEventListener('click', function () {
  getCountrydata('india');
  // getCountrydata('australia');
});

const getJSON = function (url, errorMsg = 'something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }
    return response.json();
  });
};

// const whereAmI = function (lats, longs) {
//   fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lats}&lon=${longs}`)
//     .then(response => {
//       console.log(response);
//       return response.json();
//     })
//     .then(data => {
//       console.log(data);
//     });
// };
// whereAmI(51.50354, -0.12768);

//////////////////////////////PROMISES////////////////////////////////////
/*
const loterypromise = new Promise(function (resolve, reject) {
  if (Math.random() >= 0.5) {
    resolve('Yow won');
  } else {
    reject('You lost');
  }
});

loterypromise.then(res => console.log(res)).catch(err => console.error(err));

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(2)
  .then(() => {
    console.log('I waited 2 sec');
    return wait(1);
  })
  .then(() => console.log('waited 1 sec'));
*/

//promisifying the Geo-location api

// const getPosition = function () {
//   return new Promise(function (resolve, reject) {
//     //   navigator.geolocation.getCurrentPosition(
//     //     position => resolve(position),
//     //     err => reject(err)
//     //   );
//     // });
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   });
// };

// getPosition()
//   .then(pos => console.log(pos))
//   .catch(err => console.error(err));

// const imageContainer = document.querySelector('.images');
// /** Working with images */

// const createImg = function (imgPath) {
//   return new Promise(function (resolve, reject) {
//     const img = document.createElement('img');
//     img.src = imgPath;

//     img.addEventListener('load', function () {
//       imageContainer.append(img);
//       resolve(img);
//     });
//     img.addEventListener('error', function () {
//       reject(new Error('img not found'));
//     });
//   });
// };
// createImg('img/img-1.jpg').then(img => console.log('image is loded'));

//ES2017-->ayanc and await

// const whereAmI = async function (country) {
//   // fetch(`https://restcountries.com/v3.1/name/${country}`).then(res =>
//   //   console.log(res)
//   // ); // async/await is a syntaical sugar over then method in promises

//   const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
//   console.log(res);
//   const data = await res.json();
//   console.log(data);
//   // renderCountry(data[0]);
// };

// console.log('async/await');
// whereAmI('india');

// Promise.all([
//   Promise.resolve('sucess1'),
//   Promise.resolve('sucess 2'),
//   Promise.reject('rejected'),
// ]).then(res => console.log(res));

// Promise.allSettled([
//   Promise.resolve('sucess 1'),
//   Promise.resolve('sucess 2'),
//   Promise.reject('not sucess'),
// ]).then(res => console.log(res));

// Promise.race([
//   Promise.resolve('sucess1'),
//   Promise.resolve('sucess 2'),
//   Promise.reject('not sucess'),
// ]).then(res => console.log(res));

// Promise.any([
//   Promise.reject('not sucess'),
//   Promise.resolve('sucess 2'),
//   Promise.resolve('sucess 1'),
//   Promise.reject('not sucess'),
// ]).then(res => console.log(res));
