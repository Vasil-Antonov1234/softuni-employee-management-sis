import { useEffect, useState } from "react"
import Footer from "./components/Footer.jsx"
import Header from "./components/Header.jsx"
import SearchForm from "./components/SearchForm.jsx"
import UserList from "./components/UserList.jsx"
import Pagination from "./components/Pagination.jsx"
import SaveUserModal from "./components/SaveUserModal.jsx"
import DetailsUserModal from "./components/DetailsUserModal.jsx"
import DeleteUserModal from "./components/DeleteUserModal.jsx"

function App() {
    const [users, setUsers] = useState([]);
    const [forceRefresh, setForceRefresh] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isAscendingSort, setIsAscendingSort] = useState(true);
    const [isActiveModal, setIsActiveModal] = useState({});
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState(0);

    useEffect(() => {

        (async function getUsers() {
            try {
                const response = await fetch("http://localhost:3030/jsonstore/users");
                const data = await response.json();
                const allUsers = Object.values(data);
                const page = allUsers.slice((currentPage - 1) * pageSize, pageSize * currentPage)
                const pagesCount = Math.ceil(allUsers.length / pageSize);

                setPages(pagesCount);
                setUsers(page);
            } catch (error) {
                alert(error.message);
            }
        })()

    }, [forceRefresh, pageSize, currentPage]);

    function selectPageSizeHandler(value) {
        setPageSize(value);
    };

    function nextPageClickHandler() {

        if (currentPage + 1 <= pages) {
            setCurrentPage(state => state + 1);
        }

    };

    function previousPageClickHandler() {

        if (currentPage - 1 > 0) {
            setCurrentPage(state => state - 1);
        }
    };

    function firstPageClickHandler() {
        setCurrentPage(1);
    };

    function lastPageClickHandler() {
        setCurrentPage(pages);
    };

    function changeModalStateHandler(userId, currentState) {

        if (currentState) {
            setSelectedUserId(userId);
            setIsActiveModal(currentState);
        };

        if (typeof (userId) !== "string") {
            setIsActiveModal({ state: "create" });
        };
    };

    function forceRefreshHandler() {
        setForceRefresh(state => !state)
    }

    function sortUsersClickHandler() {

        if (isAscendingSort) {
            setUsers(state => state.slice().sort((userA, userB) => new Date(userB.createdAt) - new Date(userA.createdAt)));
        }

        if (!isAscendingSort) {
            setUsers(state => state.slice().sort((userA, userB) => new Date(userA.createdAt) - new Date(userB.createdAt)));
        }

        setIsAscendingSort(state => !state);
    };

    function closeUserModalHandlers() {
        setIsActiveModal({});
        setSelectedUserId(null);
    };

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
                        onShowDetails={changeModalStateHandler}
                        onShowDelete={changeModalStateHandler}
                        onEditClick={changeModalStateHandler}
                        onSort={sortUsersClickHandler}
                    />

                    <button className="btn-add btn" onClick={changeModalStateHandler}>Add new user</button>

                    {isActiveModal.state === "create" &&
                        <SaveUserModal
                            onClose={closeUserModalHandlers}
                            onSubmit={addUserSubmitHandler}
                        />}

                    {isActiveModal.state === "details" &&
                        <DetailsUserModal
                            onCloseDetails={closeUserModalHandlers}
                            userId={selectedUserId}
                        />}

                    {isActiveModal.state === "delete" &&
                        <DeleteUserModal
                            onCloseDelete={closeUserModalHandlers}
                            onRefresh={forceRefreshHandler}
                            userId={selectedUserId}
                            userEmail={isActiveModal.email}
                        />}

                    {isActiveModal.state === "edit" &&
                        <SaveUserModal
                            userId={selectedUserId}
                            onClose={closeUserModalHandlers}
                            onRefresh={forceRefreshHandler}
                            onSubmit={addUserSubmitHandler}
                            isEditUser
                        />}

                    <Pagination
                        onSelect={selectPageSizeHandler}
                        onNextPage={nextPageClickHandler}
                        onPreviouysPage={previousPageClickHandler}
                        onFirstPage={firstPageClickHandler}
                        onLastPage={lastPageClickHandler}
                        pages={pages}
                        currentPage={currentPage}
                    />

                </section>

            </main>

            <Footer />

        </div>
    )
}

export default App
