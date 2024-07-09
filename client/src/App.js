import axios from 'axios'; // dependencies
import { useState } from 'react'; // use hook to manage state
import './App.css'; // styling

const App = () => {
  const [chosenType, setChosenType] = useState(null); // once user selects from type dropdown
  const [chosenMag, setChosenMag] = useState(null); // once user selects from mag dropdown
  const [chosenLocation, setChosenLocation] = useState(null); // once user types location
  const [chosenDateRange, setChosenDateRange] = useState(null); // once user selects date dropdown
  const [chosenSortOption, setchosenSortOption] = useState(null); // once user selects sort dropdown
  const [documents, setDocuments] = useState(null);

  const sendSearchRequest = () => { // on search button click
    const results = { // send a get req to server with a url ending in /results which is passed to the params collected
      method: 'GET',
      url: 'http://localhost:3001/results',
      params: {
        type: chosenType,
        mag: chosenMag,
        location: chosenLocation,
        dateRange: chosenDateRange,
        sortOption: chosenSortOption,
      },
    };
    axios // send get request to server using axios
      .request(results)
      .then((response) => {
        console.log(response.data);
        setDocuments(response.data); // update state var documents to inlude documents received from the server
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return ( // what the user sees at start
    <div className='app'>
      <nav>
        <ul className='nav-bar'>
          <li>Earthquake Watch</li> {/* app name displayed on page */}
        </ul>
      </nav>
      <p className='directions'>
        {' '}
        Search for earthquakes using the following criteria: {/* directions text displayed on page */}
      </p>
      <div className='main'>
        <div className='type-selector'>
          <ul>
            <li> {/* dropdown */}
              <select 
                name='types'
                id='types'
                value={chosenType}
                onChange={(e) => setChosenType(e.target.value)}
              > {/* options for dropdown */}
                <option value={null}>Select a Type</option>
                <option value='earthquake'>Earthquake</option>
                <option value='quarry blast'>Quarry Blast</option>
                <option value='ice quake'>Ice Quake</option>
                <option value='explosion'>Explosion</option>
              </select>
            </li>
            <li>{/* magnitude selection dropdown */}
              <select
                name='mag'
                id='mag'
                value={chosenMag}
                onChange={(e) => setChosenMag(e.target.value)}
              > 
                <option value={null}>Select magnitude level</option>
                <option value='2.5'>2.5+</option>
                <option value='5.5'>5.5+</option>
                <option value='6.1'>6.1+</option>
                <option value='7'>7+</option>
                <option value='8'>8+</option>
              </select>
            </li>
            <li>
              <form> {/* form for state, city, or country*/}
                <label>
                  <input
                    className='form'
                    type='text'
                    placeholder='Enter city, state, country'
                    value={chosenLocation}
                    onChange={(e) => setChosenLocation(e.target.value)}
                  />
                </label>
              </form>
            </li>
            <li>{/* dropdown for date range*/}
              <select
                name='dateRange'
                id='dateRange'
                value={chosenDateRange}
                onChange={(e) => setChosenDateRange(e.target.value)}
              >
                <option value={null}>Select date range</option>
                <option value='7'>Past 7 Days</option>
                <option value='14'>Past 14 Days</option>
                <option value='21'>Past 21 Days</option>
                <option value='30'>Past 30 Days</option>
              </select>
            </li>
            <li>{/* dropdown for filter*/}
              <select
                name='sortOption'
                id='sortOption'
                value={chosenSortOption}
                onChange={(e) => setchosenSortOption(e.target.value)}
              >
                <option value={null}>Sort by</option>
                <option value='desc'>Largest Magnitude First</option>
                <option value='asc'>Smallest Magnitude First</option>
              </select>
            </li>
            <li>
              <button onClick={sendSearchRequest}>Search</button> {/*search button onClick calls sendSearchReq fucntion*/}
            </li>
          </ul>
        </div>
        {documents && ( // handles documents recieved from the server (render once documents are recieved from the server)
          <div className='search-results'>
            {documents.length > 0 ? ( // ternary operator to specify the number of documents displayed
              <p> Number of hits: {documents.length}</p>
            ) : (
              <p> No results found. Try broadening your search criteria.</p> // if number of documents returned are 0
            )}
            {documents.map((document) => ( // runs through the document and card information is displayed
              <div className='results-card'> {/*card displayed information */}
                <div className='results-text'>
                  <p>Type: {document._source.type}</p>
                  <p>Time: {document._source['@timestamp']}</p>
                  <p>Location: {document._source.place}</p>
                  <p>Latitude: {document._source.coordinates.lat}</p>
                  <p>Longitude: {document._source.coordinates.lon}</p>
                  <p>Magnitude: {document._source.mag}</p>
                  <p>Depth: {document._source.depth}</p>
                  <p>Significance: {document._source.sig}</p>
                  <p>Event URL: {document._source.url}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;