const steps = [
  {
    number: "01 / DISCOVER",
    title: "Understand",
    description:
      "We talk about your business, audience, goals and what the website actually needs to accomplish."
  },
  {
    number: "02 / BUILD",
    title: "Design & Build",
    description:
      "I turn the direction into a clean, responsive interface and build the experience from the ground up."
  },
  {
    number: "03 / LAUNCH",
    title: "Ship",
    description: "After feedback and final polish, your website goes live and is ready for real customers."
  }
];

export default function Process() {
  return (
    <section>
      <div className="container">
        <div className="section-intro">
          <div className="section-number">04 — PROCESS</div>
          <h2 className="section-title">
            Simple process.
            <br />
            <em>Serious results.</em>
          </h2>
        </div>

        <div className="process">
          {steps.map((step) => (
            <div className="process-item" key={step.title}>
              <div className="process-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
