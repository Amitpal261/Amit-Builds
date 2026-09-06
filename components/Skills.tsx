const skills = [
  { name: "UI / UX Design", type: "Design" },
  { name: "React & Frontend", type: "Development" },
  { name: "JavaScript / TypeScript", type: "Development" },
  { name: "Responsive Web Design", type: "Experience" },
  { name: "API & Backend", type: "Engineering" }
];

export default function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <div className="section-intro">
          <div className="section-number">03 — SKILLS</div>
          <h2 className="section-title">
            Tools I use to turn
            <br />
            <em>ideas into products.</em>
          </h2>
        </div>

        <div className="skills-list">
          {skills.map((skill, i) => (
            <div className="skill" key={skill.name}>
              <div className="skill-number">{String(i + 1).padStart(2, "0")}</div>
              <div className="skill-name">{skill.name}</div>
              <div className="skill-type">{skill.type}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
