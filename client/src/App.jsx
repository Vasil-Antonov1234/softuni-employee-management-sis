import Footer from "./components/Footer.jsx"
import Header from "./components/Header.jsx"
import SearchForm from "./components/SearchForm.jsx"
import UserList from "./components/UserList.jsx"
import Pagination from "./Pagination.jsx"

function App() {

  return (
    <div>
      <Header />

      <main className="main">
        <section className="card users-container">

          <SearchForm />

          <UserList />

          <Pagination />
        
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
