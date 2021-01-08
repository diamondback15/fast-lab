import useSWR from 'swr'
import styled from 'styled-components'
import { useState } from 'react'
import { faCheckCircle, faSearch, faTimesCircle, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Skeleton from 'react-loading-skeleton';
import Footer from '../components/Footer/Footer'

const S = {}

S.Container = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

S.Main = styled.main`
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

S.List = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  max-width: 1000px;

  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

S.Item = styled.div`
  display: grid;
  position: relative;
  cursor: pointer;
  opacity: ${props => props.isSelected ? '0.8' : '1'};
  transition: all .3s;

  img {
    width: 100%;
  }

  &:hover {
    box-shadow: 0 0 2rem rgba(255,255,255,.3);
  }
`

S.AddedIcon = styled.div`
  display: block;
  position: absolute;
  width: 40%;
  height: auto;
  z-index: 3;
  top: 50%;
  left: 0;
  right: 0;
  margin: 0 auto;
  transform: translate(0, -50%);
  color: green;
  background: white;
  border-radius: 100rem;
  line-height: 0;

  & > svg {
    width: 100%!important;
    height: 100%;
  }
`

S.SearchBar = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
  max-width: 1000px;
  place-items: center;
  background: white;
  border-radius: .4rem;
  padding-right: 1rem;
  padding-left: 1.5rem;
  margin-bottom: 2rem;
`

S.Button = styled.div`
  width: 100%;
  color: black;
  padding: 1rem;
  background: white;
  border-radius: .4rem;
  line-height: 0;
  max-height: 55px;
  cursor: pointer;
`

S.Input = styled.input`
  font-size: 20px;
  padding: 1rem 0rem;
  padding-right: 0rem;
  border: none;

  &:focus {
    outline: none;
  }
`

S.Skeleton = styled(Skeleton)`
  display: block;
  position: relative;
  cursor: pointer;
  height: 352px;
`

S.CheckoutBar = styled.div`
  display: block;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 1rem 0;
  background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.8), rgba(0,0,0,1));
`

S.CheckoutButton = styled.button`
  display: inline-block;
  font-size: 20px;
  background: white;
  border: none;
  padding: 1rem 2rem;
  cursor: pointer;
  border-radius: 10rem;
`

S.CheckoutList = styled.div`
  display: block;
  color: black;
  width: 100%;
`

S.CheckoutListItem = styled.div`
  margin-bottom: .1rem;
  padding: 1rem 1rem;
  display: grid;
  grid-template-columns: 1fr auto;
  background: white;
`

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('batman')
  const { data } = useSWR(`http://www.omdbapi.com/?s=${searchQuery}&apikey=45be6541`)
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedMovies, setSelectedMovies] = useState([])
  const [searchField, setSearchField] = useState('')

  const addMovie = (e) => {    
    if(selectedMovies.filter(v => v.imdbID === e.imdbID).length <= 0) {
      setSelectedMovies([...selectedMovies, e])
    } else {
      removeMovie(e.imdbID)
    }  
  }

  const removeMovie = (imdbID) => {    
    const filteredItems = selectedMovies.filter(item => item.imdbID !== imdbID)
    setSelectedMovies(filteredItems)
  }

  const submitForm = () => {
    setSearchQuery(searchField)
  }

  return (
    <S.Container>
      <S.Main>
        { currentPage === 'home' && (
          <>
            <S.SearchBar>
              <S.Input placeholder={'Search a movie...'} type='text' onChange={e => setSearchField(e.target.value)} />
              <S.Button onClick={() => submitForm()}>
                <FontAwesomeIcon icon={faSearch} />
              </S.Button>
            </S.SearchBar>
            <S.List>
              { !!data ? data.Search.map(({Poster, Title, imdbID}) =>
                <S.Item 
                  title={Title}
                  key={imdbID}
                  onClick={() => addMovie({Title, imdbID})}
                  isSelected={selectedMovies.filter(e => e.imdbID !== imdbID).length > 0}
                > 
                  <img src={Poster} />
                  {selectedMovies.filter(v => v.imdbID === imdbID).length > 0 && (
                    <S.AddedIcon key={imdbID}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </S.AddedIcon>
                  )}
                </S.Item>
              ) : [...Array(4)].map((e, i) => <S.Skeleton key={i} />)}
            </S.List>
          </>
        )}

        {currentPage === 'checkout' &&
          <S.CheckoutList>
            {selectedMovies.map((e, i) => (
              <S.CheckoutListItem key={i}>
                <div style={{ marginRight: '1rem' }}>{e.Title}</div>
                <div onClick={() => removeMovie(e.imdbID)}><FontAwesomeIcon icon={faTimesCircle} /></div>
              </S.CheckoutListItem>
            ))}
          </S.CheckoutList>
        }
      </S.Main>
      
      <S.CheckoutBar>
        {currentPage === 'home' && <S.CheckoutButton onClick={() => setCurrentPage('checkout')}>Checkout</S.CheckoutButton>}
        {currentPage === 'checkout' && <S.CheckoutButton onClick={() => setCurrentPage('home')}>Home</S.CheckoutButton>}
      </S.CheckoutBar>
      <Footer />
    </S.Container>
  )
}

export default Home