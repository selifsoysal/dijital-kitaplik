import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface AddBookModalProps {
  show: boolean;
  onClose: () => void;
  onBookAdded: () => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ show, onClose, onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    authorId: 0,
    categoryId: 0,
    pageCount: 0,
    description: "",
    coverImagePath: null as File | null,
    tagIds: [] as string[],
  });

  const [authors, setAuthors] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (show) {
      fetch("http://localhost:5000/api/Authors")
        .then((res) => res.json())
        .then((data) => setAuthors(data));

      fetch("http://localhost:5000/api/Categories")
        .then((res) => res.json())
        .then((data) => setCategories(data));

      fetch("http://localhost:5000/api/Tags")
        .then((res) => res.json())
        .then((data) => setTags(data));
    }
  }, [show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, coverImagePath: e.target.files?.[0] || null });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const updatedTagIds = checked
      ? [...formData.tagIds, value]
      : formData.tagIds.filter((id) => id !== value);
    setFormData({ ...formData, tagIds: updatedTagIds });
  };

  const handleSubmit = () => {
    const dataToSend = {
      Title: formData.title,
      AuthorId: formData.authorId,
      CategoryId: formData.categoryId,
      PageCount: formData.pageCount,
      Description: formData.description,
      TagIds: formData.tagIds,
    };

    if (formData.coverImagePath) {
      const formDataToSend = new FormData();
      formDataToSend.append("Title", formData.title);
      formDataToSend.append("AuthorId", formData.authorId.toString());
      formDataToSend.append("CategoryId", formData.categoryId.toString());
      formDataToSend.append("PageCount", formData.pageCount.toString());
      formDataToSend.append("Description", formData.description);
      formDataToSend.append("CoverImagePath", formData.coverImagePath);

      if (formData.tagIds.length > 0) {
        formData.tagIds.forEach(tagId => {
          formDataToSend.append("TagIds", tagId);
        });
      }

      fetch("http://localhost:5000/api/Books", {
        method: "POST",
        body: formDataToSend,
      }).then((res) => {
        if (res.ok) {
          onBookAdded();
          onClose();
        } else {
          res.text().then((text) => {
            alert(`Failed to add book: ${text}`);
          });
        }
      });
    } else {
      fetch("http://localhost:5000/api/Books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then((res) => {
          if (res.ok) {
            onBookAdded();
            onClose();
          } else {
            res.text().then((text) => {
              alert(`Failed to add book: ${text}`);
            });
          }
        })
        .catch((error) => {
          alert(`Error: ${error.message}`);
        });
    }
  };

  return (
    <Modal show={show} onHide={onClose} >
      <Modal.Header closeButton>
        <Modal.Title>Yeni Kitap Ekle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Kitap Adı</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Kitap adı"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Sayfa Sayısı</Form.Label>
            <Form.Control
              name="pageCount"
              value={formData.pageCount}
              onChange={handleChange}
              placeholder="Sayfa sayısı"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Kategori</Form.Label>
            <Form.Control
              as="select"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">Kategori Seçin</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Yazar</Form.Label>
            <Form.Control
              as="select"
              name="authorId"
              value={formData.authorId}
              onChange={handleChange}
            >
              <option value="">Yazar Seçin</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Açıklama</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Kitap açıklaması"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Kapak Resmi</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Etiketler</Form.Label>
            {tags.map((tag) => (
              <Form.Check
                key={tag.id}
                type="checkbox"
                label={tag.name}
                value={tag.id.toString()}
                checked={formData.tagIds.includes(tag.id.toString())}
                onChange={handleTagChange}
              />
            ))}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          İptal
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Kaydet
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBookModal;
