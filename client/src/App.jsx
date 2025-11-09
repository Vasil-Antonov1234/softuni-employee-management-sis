import { useEffect, useState } from "react"
import Footer from "./components/Footer.jsx"
import Header from "./components/Header.jsx"
import SearchForm from "./components/SearchForm.jsx"
import UserList from "./components/UserList.jsx"
import Pagination from "./Pagination.jsx"
import SaveUserModal from "./components/SaveUserModal.jsx"
import DetailsUserModal from "./components/DetailsUserModal.jsx"
import DeleteUserModal from "./components/DeleteUserModal.jsx"

function App() {
    const [users, setUsers] = useState([]);
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showUserDelete, setShowDeleteUser] = useState(false);
    const [showUserEdit, setShowUserEdit] = useState(false);

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

    function forceRefreshHandler() {
        setForceRefresh(state => !state)
    }

    function addUserClickHandler() {
        setShowCreateUser(true);
    };

    function sortUsersClickHandler() {
        setUsers(state => state.slice().sort((userA, userB) => new Date(userB.createdAt) - new Date(userA.createdAt)));
    };

    function editActionClickHandler(userId) {
        setSelectedUserId(userId);
        setShowUserEdit(true);
    };

    function showClickUserDetailsHandler(userId) {
        setSelectedUserId(userId);
        setShowUserDetails(true);
    };

    function closeUserModalHandlers() {
        setShowCreateUser(false);
        setShowUserDetails(false);
        setShowDeleteUser(false);
        setShowUserEdit(false);
        setSelectedUserId(null);
    };

    function showClickUserDeleteHandler(userId) {
        setSelectedUserId(userId);
        setShowDeleteUser(true);
    }

    async function addUserSubmitHandler(event, isEditUser, userId) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const { country, city, street, streetNumber, ...userData } = Object.fromEntries(formData);
        userData.address = {
            country,
            city,
            street,
            streetNumber
        };

        if (isEditUser) {
            userData.updatedAt = new Date().toISOString();
        };
        userData.createdAt = new Date().toISOString();

        if (!isEditUser) {
            try {
                const response = await fetch("http://localhost:3030/jsonstore/users", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                console.log(result);

                closeUserModalHandlers();
                forceRefreshHandler();
            } catch (error) {
                alert(error.message);
            };
        } else {
            try {
                const response = await fetch(`http://localhost:3030/jsonstore/users/${userId}`, {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                console.log(result);

                closeUserModalHandlers();
                forceRefreshHandler();
            } catch (error) {
                alert(error.message);
            }
        };
    };

    return (
        <div>

            <Header />

            <main className="main">

                <section className="card users-container">

                    <SearchForm />

                    <UserList
                        users={users}
                        onShowDetails={showClickUserDetailsHandler}
                        onShowDelete={showClickUserDeleteHandler}
                        onEditClick={editActionClickHandler}
                        onSort={sortUsersClickHandler}
                    />

                    <button className="btn-add btn" onClick={addUserClickHandler}>Add new user</button>

                    {showCreateUser &&
                        <SaveUserModal
                            onClose={closeUserModalHandlers}
                            onSubmit={addUserSubmitHandler}
                        />}

                    {showUserDetails &&
                        <DetailsUserModal
                            onCloseDetails={closeUserModalHandlers}
                            userId={selectedUserId}
                        />}

                    {showUserDelete &&
                        <DeleteUserModal
                            onCloseDelete={closeUserModalHandlers}
                            onRefresh={forceRefreshHandler}
                            userId={selectedUserId}
                        />}

                    {showUserEdit &&
                        <SaveUserModal
                            userId={selectedUserId}
                            onClose={closeUserModalHandlers}
                            onRefresh={forceRefreshHandler}
                            onSubmit={addUserSubmitHandler}
                            isEditUser
                        />}

                    <Pagination />

                </section>

            </main>

            <Footer />

        </div>
    )
}

export default App
