const fs = require('fs');
const axios = require('axios');


const levels = {
  'Débutant': 1,
  'Intermédiaire': 2,
  'Avancé': 3,
  'Courant': 4,
  'Langue maternelle': 5,
};

const transform = async (input) => {
  // Your code here
  const {id, firstname, lastname } = input

  let newObj = {
    id,
    firstname,
    lastname,
    dob: input.birthday? input.birthday : null,
    address : {
      zipcode: input.zipCode,

      street: input.street,

      city: input.city,

    }

  }

  const countryObj = await axios.get('https://restcountries.eu/rest/v2/all')
    .then((response => response.data.filter(el => el.name == input.country)
  ))

  //console.log('countryObj: ', countryObj[0].alpha2Code)
  newObj.address.countryCode = countryObj[0].alpha2Code;



  newObj.experiences = input.experiences.map(exp => {
    return {
      companyName: exp.companyName,
      startDate: exp.startDate,
      endDate: exp.endDate,
      jobId: exp.job.id
    }

  })


  newObj.certificates = input.certificates.map(cert => {
    return {
      date: cert.date,
      certificate: cert.certificate.title,
      type: cert.certificateType.title

    }
  })

  newObj.languages = []
  for (lang of input.languages) {
    newObj.languages.push( {
      languageId: lang.id,
      title: lang.title,
      levelTitle: lang.level,
      level: levels[lang.level]
    })
  }

  console.log(newObj)
  return newObj;
};

(async () => {
  const inStr = fs.readFileSync('./in.json', 'UTF-8');
  const jsonIn = JSON.parse(inStr);
  const output = await transform(jsonIn);
  const outStr = JSON.stringify(output, null, 2);
  fs.writeFileSync('./out.json', outStr);
})();
