import Image from "next/image";

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="section-intro about-intro">
          <div className="about-intro-side">
            <div className="section-number">02 — ABOUT</div>
            <div className="about-image">
              <Image
                src="https://res.cloudinary.com/dmtcpwldk/image/upload/v1788715230/Gemini_Generated_Image_3ei5km3ei5km3ei5_znmhdo.png"
                alt="A programmer working at a desk"
                fill
                sizes="(max-width: 850px) 100vw, 38vw"
                priority
              />
            </div>
          </div>

          <h2 className="section-title">
            More than just
            <br />
            <em>writing code.</em>
          </h2>
        </div>

        <div className="about-grid">
          <div />
          <div>
            <p className="about-copy">
              I care about the space between <span>design, technology and business.</span>
            </p>
            <p className="about-small">
              My goal isn&apos;t to make another website that simply &quot;looks good&quot;. I
              build digital experiences that communicate clearly, load quickly and make a
              business feel more trustworthy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
