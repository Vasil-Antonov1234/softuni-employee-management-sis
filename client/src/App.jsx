import { useState } from "react"
import Footer from "./components/Footer.jsx"
import Header from "./components/Header.jsx"
import SearchForm from "./components/SearchForm.jsx"
import UserList from "./components/UserList.jsx"
import Pagination from "./Pagination.jsx"
import CreateUserModal from "./components/CreateUserModal.jsx"

function App() {
    const [showCreateUser, setShowCreateUser] = useState(false);

    function addUserClickHandler() {
        setShowCreateUser(true);
    };

    function closeCreateUserModal() {
        setShowCreateUser(false);
    };

    return (
        <div>

            <Header />

            <main className="main">

                <section className="card users-container">

                    <SearchForm />

                    <UserList />

                    <button className="btn-add btn" onClick={addUserClickHandler}>Add new user</button>

                    {showCreateUser && <CreateUserModal onClose={closeCreateUserModal} />}

                    <Pagination />

                </section>

            </main>

            <Footer />

        </div>
    )
}

export default App
