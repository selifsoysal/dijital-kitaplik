import React, { useEffect, useState } from 'react';
import { useLoggedInInfoContext } from '../../components/Contexts/LoggedInInfoContex';
import BookCard from '../../components/Cards/BookCard';
import { useNavigate } from 'react-router-dom';
import { FaCaretDown, FaCaretUp, FaTrashAlt } from 'react-icons/fa'; // For dropdown and delete icons
import './ReadingListPage.css';

const ReadingListPage: React.FC = () => {
  const { loggedInInfo } = useLoggedInInfoContext();
  const [readingLists, setReadingLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openList, setOpenList] = useState<number | null>(null);
  const navigate = useNavigate();

  const isUserLoggedIn = loggedInInfo?.userId;

  useEffect(() => {
    if (!isUserLoggedIn) return;

    fetch(`http://localhost:5000/api/readinglists/user/${loggedInInfo.userId}`)
      .then((response) => response.json())
      .then((data) => {
        setReadingLists(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching reading lists:', error);
        setLoading(false);
      });
  }, [loggedInInfo, isUserLoggedIn]);

  const handleListClick = (listId: number) => {
    setOpenList(openList === listId ? null : listId);
  };

  const handleDeleteList = (listId: number) => {
    if (!isUserLoggedIn) {
      console.error('User is not logged in!');
      return;
    }

    fetch(`http://localhost:5000/api/readinglists/user/${loggedInInfo.userId}/reading-list/${listId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        setReadingLists(readingLists.filter((list) => list.id !== listId));
      })
      .catch((error) => {
        console.error('Error deleting reading list:', error);
      });
  };

  const handleRemoveBookFromList = (bookId: number, listId: number) => {
    if (!isUserLoggedIn) {
      console.error('User is not logged in!');
      return;
    }

    fetch(`http://localhost:5000/api/readinglists/user/${loggedInInfo.userId}/reading-list/${listId}/remove-book/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ReadingListId: listId,
        BookId: bookId,
        userId: loggedInInfo.userId,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setReadingLists((prevLists) =>
          prevLists.map((list) =>
            list.id === listId
              ? { ...list, books: list.books.filter((book: any) => book.id !== bookId) }
              : list
          )
        );
      })
      .catch((error) => {
        console.error('Error removing book from list:', error);
      });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="reading-list-page">
      <h2>Okuma Listem</h2>
      {readingLists.length === 0 ? (
        <p>You have no reading lists.</p>
      ) : (
        readingLists.map((list) => (
          <div key={list.id} className="reading-list">
            <div className="reading-list-header" onClick={() => handleListClick(list.id)}>
              <h3 className="reading-list-title">{list.name}</h3>
              <div className='readlistbuttons'>
                <FaTrashAlt
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteList(list.id);
                  }}
                  className="delete-list-icon"
                />
                <span className="dropdown-icon">
                  {openList === list.id ? <FaCaretUp /> : <FaCaretDown />}
                </span>
              </div>
            </div>
            {openList === list.id && (
              <div className="book-list">
                {list.books.map((book: any) => (
                  <div key={book.id} className="book-card-container">
                    <BookCard
                      bookId={book.id}
                      title={book.title}
                      coverImagePath={`http://localhost:5000/${book.coverImagePath}`}
                      author={book.authorName}
                      authorId={book.authorId}
                      onBookClick={() => navigate(`/book/${book.id}`)}
                      onAuthorClick={() => navigate(`/authors/${book.authorId}`)}
                      showAddButton={false}
                      onAddToReadingList={function (bookId: number): void {
                        throw new Error('Function not implemented.');
                      }}
                    />
                    <button
                      className="btn remove-book-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBookFromList(book.id, list.id);
                      }}
                    >
                      Okuma Listemden Çıkar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReadingListPage;
