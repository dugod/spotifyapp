import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { BrowserRouter, Routes, Route} from "react-router-dom";

function App() {

  const CLIENT_ID = "bf1dbd0fea4c406c9068d12b2f20a1cc"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPE = "user-top-read"
  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [albums, setAlbums] = useState([])
  const [userData, setUserData] = useState([])
  const [topTracks, setTopTracks] = useState([])


  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")
  
    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
  
        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }
  
    setToken(token)
  
  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
}

const searchArtists = async (e) => {
  e.preventDefault()
  const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
          Authorization: `Bearer ${token}`
      },
      params: {
          q: searchKey,
          type: "artist"
      }
  })

  setArtists(data.artists.items)
  console.log(data);
}

const renderArtists = () => {
  return artists.map(artist => (
      <div key={artist.id}>
          {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
          {artist.name}
      </div>
  ))
}

const searchAlbums = async (e) => {
  e.preventDefault()
  const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
          Authorization: `Bearer ${token}`
      },
      params: {
          q: searchKey,
          type: "album"
      }
  })

  setAlbums(data.albums.items)
  console.log(data);
}

const renderAlbums = () => {
  // return albums.map(album => (
  //     <div key={album.id}>
  //         {album.images.length ? <img width={"100%"} src={album.images[0].url} alt=""/> : <div>No Image</div>}
  //         {album.name}
  //     </div>
  // ))
  return albums.map(album => ( 
    <li key = {album.id}>
      <Card>
        <Card.Img src={album.images[0].url}/>
        <Card.Body>
          <Card.Title>{album.name}</Card.Title>
        </Card.Body>
      </Card>
    </li>
  ))
}

const getUserProfile = async (e) => {
  e.preventDefault()
  const {data} = await axios.get("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  setUserData(data);
  console.log(data);
}

const getTopTracks = async (e) => {
  e.preventDefault()
  const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
          Authorization: `Bearer ${token}`
      },
      params: {
        time_range: 'short_term',
        limit: 50
      }
      
  })

  setTopTracks(data.items)
  console.log(data);
}

const renderTopTracks = () => {
  return topTracks.map(topTracks => (
    <li key = {topTracks.id}>
    <Card>
      <Card.Img src={topTracks.album.images[0].url}/>
      <Card.Body>
        <Card.Title>{topTracks.name}</Card.Title>
      </Card.Body>
    </Card>
  </li>
  ))
}



  return (
    <div className="App">
            <header className="App-header">
                <h1>Duy Spotify App</h1>
                
            
                {/* <form onSubmit={searchArtists}>
                  <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                  <button type={"submit"}>Search</button>
                </form>

                {renderArtists()} */}

                <form onSubmit={searchAlbums}>
                  <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                  <button type={"submit"}>Search</button>
                </form>

                <Container>
                  <Row className="mx-2 row row-cols-4">
                    {renderAlbums()}
                  </Row>
                </Container>
              
                
                {/* <button onClick={getUserProfile}>User Data</button>
                <h1>{userData.display_name}</h1> */}
                
                <form onSubmit={getUserProfile}>
                  <button type={"submit"}>UserData</button>
                </form>
                <h1>{userData.display_name}</h1>

                <form onSubmit={getTopTracks}>
                  <button type={"submit"}>Get top tracks</button>
                </form>
                <Container>
                  <Row className="mx-2 row row-cols-4">
                    {renderTopTracks()}
                  </Row>
                </Container>
                
                
                
              
              

                {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login
                        to Spotify</a>
                    : <button onClick={logout}>Logout button</button>}
            </header>
          </div>
  )
}

export default App;

