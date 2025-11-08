import { useEffect, useState } from "react"
import Footer from "./components/Footer.jsx"
import Header from "./components/Header.jsx"
import SearchForm from "./components/SearchForm.jsx"
import UserList from "./components/UserList.jsx"
import Pagination from "./Pagination.jsx"
import CreateUserModal from "./components/CreateUserModal.jsx"
import DetailsUserModal from "./components/DetailsUserModal.jsx"

function App() {
    const [users, setUsers] = useState([]);
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {

        (async function getUsers() {
            try {
                const response = await fetch("http://localhost:3030/jsonstore/users");
                const data = await response.json();

                setUsers(Object.values(data));
            } catch (error) {
                alert(error.message);
            }
        })()

    }, [forceRefresh]);

    function addUserClickHandler() {
        setShowCreateUser(true);
    };

    function closeCreateUserModal() {
        setShowCreateUser(false);
    };

    function showClickUserDetailsHandler(userId) {
        setSelectedUserId(userId);
    };

    function closeUserDetailsModalHandler() {
        setSelectedUserId(null);
    };

    async function addUserSubmitHandler(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const { country, city, street, streetNumber, ...userData } = Object.fromEntries(formData);
        userData.address = {
            country,
            city,
            street,
            streetNumber
        };

        userData.createdAt = new Date().toISOString();
        userData.updatedAt = new Date().toISOString();

        try {
            const response = await fetch("http://localhost:3030/jsonstore/users", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(userData)
            })

            const result = await response.json();

            console.log(result);

            setForceRefresh(state => !state);
            closeCreateUserModal();
        } catch (error) {
            alert(error.message);
        };

    };

    return (
        <div>

            <Header />

            <main className="main">

                <section className="card users-container">

                    <SearchForm />

                    <UserList users={users} onShowDetails={showClickUserDetailsHandler} />

                    <button className="btn-add btn" onClick={addUserClickHandler}>Add new user</button>

                    {showCreateUser &&
                        <CreateUserModal
                            onClose={closeCreateUserModal}
                            onSubmit={addUserSubmitHandler}
                        />}

                    {selectedUserId &&
                        <DetailsUserModal
                            onCloseDetails={closeUserDetailsModalHandler}
                            userId={selectedUserId}
                        />}

                    <Pagination />

                </section>

            </main>

            <Footer />

        </div>
    )
}

export default App
