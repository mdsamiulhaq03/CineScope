import herobg from "../images/hero-bg.png";

export default function Header() {
  return (
    <header>
      <img src={herobg} alt="hero-bg" />
      <h1>
        <span className="text-gradient">CineScope</span> Discover{" "}
        <span className="text-gradient2">Movies</span> Without Hassle
      </h1>
    </header>
  );
}
