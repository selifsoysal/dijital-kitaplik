import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import './HeroSection.css';

const HeroSection = () => {
  const cookies = new Cookies();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const loggedInUsername = cookies.get("loggedInUsername");
    
    if (loggedInUsername) {
      setUsername(loggedInUsername);
    }
  }, []);

  return (
    <section className="hero-section text-center">
      {username ? (
        <h3>Hoşgeldin, {username}!</h3>
      ) : (
        <div>
        <h3>Hoşgeldiniz!</h3>
        <h5> Okuma listesi oluşturmak için giriş yapmalısınız.</h5>
        </div>

      )}
      <br />
      
      <h1>Keşfet, Oku, Paylaş!</h1>
      <br />
      
      <Link to="/books">
        <Button className="butonhs bg-transparent">
          Keşfetmeye Başla
        </Button>
      </Link>
    </section>
  );
};

export default HeroSection;
