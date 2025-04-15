import { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "sonner";
import Cookies from "universal-cookie";
import { useLoggedInInfoContext } from "../Contexts/LoggedInInfoContex";

interface LoginProps {
  show: boolean;
  onHide: () => void;
}

const Login: React.FC<LoginProps> = ({ show, onHide }) => {
  const cookies = new Cookies();
  const { setLoggedInInfo } = useLoggedInInfoContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateLogin = () => {
    const newErrors: { [key: string]: string } = {};
    if (!username.trim()) newErrors.username = "Kullanıcı adı boş bırakılamaz.";
    if (!password.trim()) newErrors.password = "Şifre boş bırakılamaz.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newUsername.trim()) newErrors.newUsername = "Kullanıcı adı boş bırakılamaz.";
    if (!newPassword.trim()) newErrors.newPassword = "Şifre boş bırakılamaz.";
    if (newPassword.length < 6) newErrors.newPassword = "Şifre en az 6 karakter olmalıdır.";
    if (newPassword !== confirmPassword) newErrors.confirmPassword = "Şifreler uyuşmuyor.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateLogin()) return;

    fetch("http://localhost:5000/api/authentication/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        else return { errors: { e: "Kullanıcı adı veya şifre yanlış." } };
      })
      .then((response) => {
        if ("errors" in response) {
          Object.keys(response.errors).forEach((k) => {
            toast.error(response.errors[k]);
          });
        } else {
          cookies.set("loggedInUserId", response.userId, {
            expires: new Date(response.expireDate),
          });
          cookies.set("loggedInUsername", response.username, {
            expires: new Date(response.expireDate),
          });
          cookies.set("loggedInRole", response.role, {
            expires: new Date(response.expireDate),
          });

          setLoggedInInfo(response);
          onHide();
          window.location.reload();
        }
      })
      .catch(() => toast.error("Giriş işlemi başarısız"));
  };

  const handleRegister = () => {
    if (!validateRegister()) return;

    fetch("http://localhost:5000/api/authentication/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: newUsername,
        password: newPassword,
        confirmPassword: confirmPassword,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.errors) {
          Object.keys(response.errors).forEach((k) => {
            toast.error(response.errors[k]);
          });
        } else {
          toast.success(response.message || "Kayıt başarılı!");
          setIsRegister(false);
          setNewUsername("");
          setNewPassword("");
          setConfirmPassword("");
        }
      })
      .catch(() => toast.error("Kayıt başarısız. Lütfen tekrar deneyin."));
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{isRegister ? "Kayıt Ol" : "Giriş Yap"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isRegister ? (
          <>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                value={username}
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="invalid-feedback">{errors.username}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Şifre
              </label>
              <input
                id="password"
                value={password}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="invalid-feedback">{errors.password}</div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <button className="btn btn-success" onClick={handleLogin}>
                Giriş Yap
              </button>
              <span>
                Hesabınız yok mu?{" "}
                <button className="btn btn-link p-0" onClick={() => setIsRegister(true)} >
                  Kayıt Ol
                </button>
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3">
              <label htmlFor="newUsername" className="form-label">
                Kullanıcı Adı
              </label>
              <input
                id="newUsername"
                value={newUsername}
                className={`form-control ${errors.newUsername ? "is-invalid" : ""}`}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <div className="invalid-feedback">{errors.newUsername}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                Şifre
              </label>
              <input
                id="newPassword"
                value={newPassword}
                className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="invalid-feedback">{errors.newPassword}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Şifreyi Onayla
              </label>
              <input
                id="confirmPassword"
                value={confirmPassword}
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <button className="btn btn-success" onClick={handleRegister}>
                Kayıt Ol
              </button>
              <span>
                Hesabınız var mı?{" "}
                <button className="btn btn-link p-0" onClick={() => setIsRegister(false)}>
                  Giriş Yap
                </button>
              </span>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Login;
