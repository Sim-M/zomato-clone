import HomePage from "./components/home/HomePage";
import SearchPage from "./components/search/SearchPage";
import RestaurantPage from "./components/restaurant/RestaurantPage";
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <main className="container-fluid">
        <Routes>
          <Route path="/" element={  <HomePage/>} />
          <Route path="/search/:meal_id" element={  <SearchPage/>} />
          <Route path="/restaurant/:id" element={ <RestaurantPage/>} />
   
        </Routes>
      </main>
    </>
  );
}

export default App;
