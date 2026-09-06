const items = ["Web Design", "Frontend Development", "UI / UX", "Responsive Websites"];

export default function Marquee() {
  const doubled = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <div className="marquee-item" key={i}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
