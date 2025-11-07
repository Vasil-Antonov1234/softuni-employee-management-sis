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

    async function addUserSubmitHandler(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const { country, city, street, streetNumber, ...userData} = Object.fromEntries(formData);
        userData.address = {
            country, 
            city, 
            street, 
            streetNumber
        };

        const response = await fetch("http://localhost:3030/jsonstore/users", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(userData)
        })

        const result = await response.json();

        console.log(result);
    };

    return (
        <div>

            <Header />

            <main className="main">

                <section className="card users-container">

                    <SearchForm />

                    <UserList />

                    <button className="btn-add btn" onClick={addUserClickHandler}>Add new user</button>

                    {showCreateUser && <CreateUserModal 
                                            onClose={closeCreateUserModal} 
                                            onSubmit={addUserSubmitHandler}    
                                        />}

                    <Pagination />

                </section>

            </main>

            <Footer />

        </div>
    )
}

export default App
