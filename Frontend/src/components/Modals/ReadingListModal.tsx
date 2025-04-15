import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useLoggedInInfoContext } from "../Contexts/LoggedInInfoContex";

interface ReadingListModalProps {
  show: boolean;
  onClose: () => void;
  bookId: number;
}

const ReadingListModal: React.FC<ReadingListModalProps> = ({ show, onClose, bookId }) => {
  const [readingLists, setReadingLists] = useState<{ id: number; name: string }[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [newListName, setNewListName] = useState("");
  const { loggedInInfo } = useLoggedInInfoContext();

  useEffect(() => {
    if (show) {
      if (!loggedInInfo?.userId) {
        alert("Bu işlemi gerçekleştirebilmek için giriş yapmalısınız!");
        onClose();
      } else {
        fetchReadingLists();
      }
    }
  }, [show, loggedInInfo?.userId]);

  const fetchReadingLists = () => {
    fetch(`http://localhost:5000/api/ReadingLists/user/${loggedInInfo?.userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReadingLists(data);
        } else {
          console.error("Beklenen okuma listesi verisi alınamadı:", data);
          setReadingLists([]);
        }
      })
      .catch((err) => console.error("Error fetching reading lists:", err));
  };

  const handleAddToReadingList = () => {
    if (!selectedListId) {
      alert("Lütfen bir okuma listesi seçin.");
      return;
    }

    fetch(
      `http://localhost:5000/api/ReadingLists/user/${loggedInInfo?.userId}/reading-list/${selectedListId}/add-book`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ BookIds: [bookId] }),
      }
    )
      .then((res) => {
        if (res.ok) {
          alert("Kitap okuma listesine eklendi!");
          onClose();
        } else {
          return res.text().then((text) => {
            throw new Error(`Failed to add book: ${text}`);
          });
        }
      })
      .catch((err) => {
        alert(`Kitap eklenemedi. Hata: ${err.message}`);
      });
  };

  const handleCreateReadingList = () => {
    if (!newListName.trim()) {
      alert("Liste adı boş olamaz!");
      return;
    }
  
    fetch(`http://localhost:5000/api/ReadingLists/user/${loggedInInfo?.userId}/create-reading-list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Name: newListName,
        UserId: loggedInInfo?.userId,
        BookIds: [bookId]
      }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Yeni okuma listesi oluşturuldu!");
          setNewListName("");
          fetchReadingLists();
        } else {
          return res.text().then((text) => {
            throw new Error(`Failed to create reading list: ${text}`);
          });
        }
      })
      .catch((err) => {
        alert(`Yeni liste oluşturulamadı. Hata: ${err.message}`);
      });
  };
  

  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Okuma Listene Ekle!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="readingListSelect">
          <Form.Label>Okuma Listesi Seçin</Form.Label>
          <Form.Select
            value={selectedListId ?? ""}
            onChange={(e) => setSelectedListId(Number(e.target.value))}
          >
            <option value="">Bir liste seçin</option>
            {readingLists.length > 0 ? (
              readingLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))
            ) : (
              <option value="">Okuma listesi bulunmuyor</option>
            )}
          </Form.Select>
        </Form.Group>

        <div className="text-center my-3">ya da</div>

        <Form.Group controlId="newReadingList">
          <Form.Label>Yeni Okuma Listesi Oluştur</Form.Label>
          <Form.Control
            type="text"
            placeholder="Liste adı girin"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <Button
            className="mt-2"
            variant="success"
            onClick={handleCreateReadingList}
          >
            Listeyi Oluştur
          </Button>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Kapat
        </Button>
        <Button variant="primary" onClick={handleAddToReadingList}>
          Ekle
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReadingListModal;
