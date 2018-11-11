const fs = require('fs');
const util = require('util');
const slugify = require('slugify');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const cities = [
  { 
    name: "WASHINGTON",
    state: "DC",
    zips: ["22314", "20001", "22202", "20852", "20002", "22191", "20190", "22203", "20109", "22201", "20003", "20910", "22031", "22209", "22102"]
  },
  { 
    name: "DALLAS",
    state: "TX",
    zips: ["75056", "75070", "75067", "75204", "76107", "75206", "75235", "75287", "75034", "75039", "75201", "75093", "75082", "75074", "75024"]
  },
  { 
    name: "ATLANTA",
    state: "GA",
    zips: ["30339", "30318", "30324", "30067", "30329", "30308", "30328", "30312", "30080", "30009", "30022", "30338", "30044", "30341", "30076"]
  },
  { 
    name: "NEW YORK",
    state: "NY",
    zips: ["10009", "06902", "11217", "10005", "07302", "11201", "07304", "10010", "07030", "06901", "10801", "10036", "10016", "06810", "07094"]
  },
  { 
    name: "SEATTLE",
    state: "WA",
    zips: ["98109", "98032", "98444", "98052", "98101", "98004", "98007", "98208", "98121", "98204", "98087", "98012", "98030", "98003", "98122"]
  },
  { 
    name: "LOS ANGELES",
    state: "CA",
    zips: ["92656", "92879", "91367", "92618", "92612", "90028", "90017", "91203", "92660", "92647", "92677", "90010", "92626", "92832", "92692"]
  },
  { 
    name: "HOUSTON",
    state: "TX",
    zips: ["77077", "77095", "77384", "77002", "77007", "77024", "77056", "77494", "77054", "77070", "77573", "77030", "77019", "77027", "77063"]
  },
  { 
    name: "CHICAGO",
    state: "IL",
    zips: ["60605", "60654", "60661", "60611", "60610", "60614", "60601", "60657", "60563", "60642", "60613", "60201", "60559", "60008", "60616"]
  },
  { 
    name: "PHOENIX",
    state: "AZ",
    zips: ["85281", "85251", "85044", "85282", "85022", "85016", "85226", "85224", "85392", "85206", "85035", "85027", "85301", "85248", "85283"]
  },
  { 
    name: "MINNEAPOLIS",
    state: "MN",
    zips: ["55344", "55337", "55401", "55416", "55446", "55403", "55408", "55044", "55129", "55124", "55347", "55306", "55122", "55433", "55438"]
  },
  { 
    name: "DENVER",
    state: "CO",
    zips: ["80202", "80021", "80203", "80237", "80134", "80231", "80246", "80111", "80227", "80013", "80229", "80112", "80209", "80206", "80233"]
  },
  { 
    name: "SAN FRANCISCO",
    state: "CA",
    zips: ["95134", "94536", "94568", "94103", "94588", "94105", "94806", "94538", "94107", "94597", "94566", "95123", "94565", "94015", "94404"]
  },
  { 
    name: "TAMPA",
    state: "FL",
    zips: ["33614", "33611", "33625", "33647", "33716", "33607", "33578", "33606", "33626", "33782", "33765", "33619", "33612", "33615", "33617"]
  },
  { 
    name: "AUSTIN",
    state: "TX",
    zips: ["78741", "78665", "78723", "78729", "78753", "78704", "78759", "78660", "78735", "78666", "78613", "78702", "78751", "78744", "78726"]
  },
  { 
    name: "PORTLAND",
    state: "OR",
    zips: ["97209", "97006", "97007", "98682", "97201", "97229", "97062", "97230", "98683", "97035", "97239", "97124", "98661", "97222", "97232"]
  }
]

const loadTopoJson = async (file) => await readFile(file);

const processContents = async () => {
  try {
    const data = await loadTopoJson('src-docs/zips_us_topo_pretty.json');
    const contentJSON = JSON.parse(data);
    const geoObj = contentJSON.objects.zip_codes_for_the_usa.geometries;

    for (city of cities) {
      let zipOutputJSON = {...contentJSON};
      let boundaryOutputJSON = {...contentJSON};
      const filenameForZip = slugify(`${city.name}-zip_topo.json`);
      const filenameForBoundary = slugify(`${city.name}-boundary_topo.json`);
      city.zip_areas = geoObj.filter(obj => {
        return city.zips.indexOf(obj.properties.zip) !== -1;
      });
      city.boundary = geoObj.filter(obj => {
        return city.name === obj.properties.name && city.state === obj.properties.state;
      })
      zipOutputJSON.objects.zip_codes_for_the_usa.geometries = city.zip_areas;
      boundaryOutputJSON.objects.zip_codes_for_the_usa.geometries = city.boundary;
      await writeFile(`./json/${filenameForZip}`, JSON.stringify(zipOutputJSON));
      await writeFile(`./json/${filenameForBoundary}`, JSON.stringify(boundaryOutputJSON));
    }
  } catch (err) {
    console.error("Error reading file", err);
  }
}

processContents();