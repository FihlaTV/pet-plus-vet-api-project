const petfinderApiUrl = 'http://api.petfinder.com/pet.find?';
const petfinderApiKey = '9efdec91ddde1fb83e7d7af7fb5f03ee';

function getDataFromPetfinderApi(pickAnimal, pickSize, pickSex, enterLocation, pickAge, callback) {
  const paramsObj = {
    format: 'json',
    key: petfinderApiKey,
    animal: pickAnimal,
    size: pickSize,
    sex: pickSex,
    location: enterLocation,
    age: pickAge,
    offest: '25',
    callback: '?',
  };
  let queryParams = buildQueryString(paramsObj);
  let url = petfinderApiUrl + queryParams;
  $.getJSON(url, callback);
}

function buildQueryString(myObject) {
  let queryString = Object.keys(myObject).map( (e) => {
      return e + '=' + myObject[e];
  }
    ).join('&');
  return queryString;
}

function handlePets(results) {
  if (results.media.photos == undefined && results.description.$t == undefined) {
    return `<div class="pet">
      <h2>${results.name.$t}</h2>
      <div class="petImage" style="background: url('images/default-image.jpg') center center/cover no-repeat"></div>
      <h3>Contact Info</h3>
      <p>email: <a href="${results.contact.email.$t}">${results.contact.email.$t}</a></p>
      <p>phone: <a href="tel:${results.contact.phone.$t}">${results.contact.phone.$t}</a></p>
    </div>`;
  } else if (results.media.photos == undefined) {
    return `<div class="pet">
      <h2>${results.name.$t}</h2>
      <div class="petImage" style="background: url('images/default-image.jpg') center center/cover no-repeat"></div>
      <div class="petDescription">
      <button class="clickToExpand">View more details</button>
      <p>${results.description.$t}</p>
    </div>
      <h3>Contact Info</h3>
      <p>email: <a href="${results.contact.email.$t}">${results.contact.email.$t}</a></p>
      <p>phone: <a href="tel:${results.contact.phone.$t}">${results.contact.phone.$t}</a></p>
    </div>`;
  } else if (results.contact.phone.$t == undefined && results.description.$t == undefined) {
    return `<div class="pet">
      <h2>${results.name.$t}</h2>
      <div class="petImage" style="background: url('${results.media.photos.photo[2].$t}') center center/cover no-repeat"></div>
      <h3>Contact Info</h3>
      <p>email: <a href="${results.contact.email.$t}">${results.contact.email.$t}</a></p>
    </div>`;
  } else if (results.contact.email.$t == undefined && results.description.$t == undefined) {
    return `<div class="pet">
      <h2>${results.name.$t}</h2>
      <div class="petImage" style="background: url('${results.media.photos.photo[2].$t}') center center/cover no-repeat"></div>
      <h3>Contact Info</h3>
      <p>phone: <a href="tel:${results.contact.phone.$t}">${results.contact.phone.$t}</a></p>
    </div>`;
  } else if (results.description.$t == undefined) {
      return `<div class="pet">
        <h2>${results.name.$t}</h2>
        <div class="petImage" style="background: url('${results.media.photos.photo[2].$t}') center center/cover no-repeat"></div>
        <h3>Contact Info</h3>
        <p>email: <a href="${results.contact.email.$t}">${results.contact.email.$t}</a></p>
        <p>phone: <a href="tel:${results.contact.phone.$t}">${results.contact.phone.$t}</a></p>
      </div>`;
    } else if (results.contact.phone.$t == undefined) {
      return `<div class="pet">
        <h2>${results.name.$t}</h2>
        <div class="petImage" style="background: url('${results.media.photos.photo[2].$t}') center center/cover no-repeat"></div>
        <div class="petDescription">
        <button class="clickToExpand">View more details</button>
        <p>${results.description.$t}</p>
      </div>
        <h3>Contact Info</h3>
        <p>email: <a href="${results.contact.email.$t}">${results.contact.email.$t}</a></p>
      </div>`;
    } else if (results.contact.email.$t == undefined) {
      return `<div class="pet">
        <h2>${results.name.$t}</h2>
        <div class="petImage" style="background: url('${results.media.photos.photo[2].$t}') center center/cover no-repeat"></div>
        <div class="petDescription">
        <button class="clickToExpand">View more details</button>
        <p>${results.description.$t}</p>
      </div>
        <h3>Contact Info</h3>
        <p>phone: <a href="tel:${results.contact.phone.$t}">${results.contact.phone.$t}</a></p>
      </div>`;
    } else {
      return `<div class="pet">
        <h2>${results.name.$t}</h2>
        <div class="petImage" style="background: url('${results.media.photos.photo[2].$t}') center center/cover no-repeat"></div>
        <div class="petDescription">
        <button class="clickToExpand">View more details</button>
        <p>${results.description.$t}</p>
      </div>
        <h3>Contact Info</h3>
        <p>email: <a href="${results.contact.email.$t}">${results.contact.email.$t}</a></p>
        <p>phone: <a href="tel:${results.contact.phone.$t}">${results.contact.phone.$t}</a></p>
      </div>`;
    }
  }

function returnResults(data) {
  const petResults = data.petfinder.pets.pet;
  let numberOfPets = data.petfinder.lastOffset.$t;
  if (numberOfPets == '1') {
    let petfinderResults = handlePets(petResults);
    $('.results').html(petfinderResults);
  } else {
    let petfinderResults = petResults.map((item, index) => handlePets(item));
    $('.results').html(petfinderResults);
  }
}

function searchForAPet() {
  $('form').submit(function (event) {
    event.preventDefault();
    let animal = $('.animalType > input:checked').val();
    let size = $('.animalSize > input:checked').val();
    if (! $('.animalSize > input').is(':checked')) {
      size = '';
    }
    let sex = $('.mfDiv > input:checked').val();
    if (! $('.mfDiv > input').is(':checked')) {
      sex = '';
    }
    let myLocation = $('.myLocation').val();
    let age = $('.animalAgeDiv > input:checked').val();
    if (! $('.animalAgeDiv > input').is(':checked')) {
      age = '';
    }
    $('.petvetbuttons').removeClass('hidden');
    $('.petResults').removeClass('hidden');
    getDataFromPetfinderApi(animal, size, sex, myLocation, age, returnResults);
  });
}

// function nextResults() {
//   $('.petResults').on('click', '.next', function(event) {
//     event.preventDefault();
//     let animal = $('.animalType > input:checked').val();
//     let size = $('.animalSize > input:checked').val();
//     if (! $('.animalSize > input').is(':checked')) {
//       size = '';
//     }
//     let sex = $('.mfDiv > input:checked').val();
//     if (! $('.mfDiv > input').is(':checked')) {
//       sex = '';
//     }
//     let myLocation = $('.myLocation').val();
//     let age = $('.animalAgeDiv > input:checked').val();
//     if (! $('.animalAgeDiv > input').is(':checked')) {
//       age = '';
//     }
//     getDataFromPetfinderApi(animal, size, sex, myLocation, age, returnResults);
//   });
// }
//
// function previousResults() {
//   $('.petResults').on('click', '.previous', function(event) {
//     event.preventDefault();
//     let animal = $('.animalType > input:checked').val();
//     let size = $('.animalSize > input:checked').val();
//     if (! $('.animalSize > input').is(':checked')) {
//       size = '';
//     }
//     let sex = $('.mfDiv > input:checked').val();
//     if (! $('.mfDiv > input').is(':checked')) {
//       sex = '';
//     }
//     let myLocation = $('.myLocation').val();
//     let age = $('.animalAgeDiv > input:checked').val();
//     if (! $('.animalAgeDiv > input').is(':checked')) {
//       age = '';
//     }
//     getDataFromPetfinderApi(animal, size, sex, myLocation, age, returnResults);
//   });
// }

$(searchForAPet);