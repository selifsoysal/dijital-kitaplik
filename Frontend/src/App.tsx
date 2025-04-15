import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import LoggedInInfoContextProvider, { useLoggedInInfoContext } from "./components/Contexts/LoggedInInfoContex";
import Login from "./components/Modals/Login";
import Navbar from "./components/Navbar/Navbar";
import AdminBookPage from "./pages/AdminPage/AdminBookPage";
import AuthorDetailsPage from "./pages/AuthorPage/AuthorDetailsPage";
import AuthorsPage from "./pages/AuthorPage/AuthorsPage";
import BookDetailsPage from "./pages/BookPage/BookDetailsPage";
import BooksPage from "./pages/BookPage/BooksPage";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import HomePage from "./pages/HomePage";
import ReadingListPage from "./pages/ReadingListPage/ReadingListPage";

const App = () => {
  return (
    <>
      <Toaster richColors position="top-center" />
      <LoggedInInfoContextProvider>
        <AppRoutes />
      </LoggedInInfoContextProvider>
    </>
  );
};

const AppRoutes = () => {
  const { loggedInInfo } = useLoggedInInfoContext();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/login" element={<Login show={false} onHide={() => {}} />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/book-details/:bookId" element={<BookDetailsPage />} />
        <Route path="/authors" element={<AuthorsPage />} />
        <Route path="/author/:authorId" element={<AuthorDetailsPage />} />
        <Route path="/readinglists" element={<ReadingListPage />} />
        <Route
        path="/admin-page"
        element={
          loggedInInfo?.role?.toLowerCase() === "admin" ? (
            <AdminBookPage />
          ) : loggedInInfo ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
/>
      </Routes>
    </Router>
  );
};

export default App;
