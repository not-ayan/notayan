export function SkillsSection() {
  return (
    <section className="skills-section" id="skills">
      <div className="skills-container">
        {/* Left Column: Narrative & CTA */}
        <div className="skills-left reveal-on-scroll reveal-left delay-1">
          <span className="skills-sub">my expertise</span>
          <h2 className="skills-main-title">
            crafting digital <span className="cursive-title-text">experiences</span> & solid code.
          </h2>
          <p className="skills-philosophy">
            Specializing in building premium frontends, optimizing user interfaces, and custom OS development. I focus on details that make software unforgettable.
          </p>
          <div className="skills-cta-box">
            <span className="cta-spark">✦</span>
            <p className="cta-text">Always open to learning new technologies and hacking on interesting projects.</p>
          </div>
        </div>

        {/* Right Column: Skills Categories */}
        <div className="skills-right">
          <div className="skills-category reveal-on-scroll delay-2">
            <h3 className="category-title">01 / Frontend & Dev</h3>
            <ul className="skills-list">
              <li className="skill-item">
                <span className="skill-num">01</span>
                <span className="skill-name">React & React Native</span>
                <span className="skill-dot"></span>
              </li>
              <li className="skill-item">
                <span className="skill-num">02</span>
                <span className="skill-name">TypeScript / JavaScript</span>
                <span className="skill-dot"></span>
              </li>
              <li className="skill-item">
                <span className="skill-num">03</span>
                <span className="skill-name">TailwindCSS & CSS Grid</span>
                <span className="skill-dot"></span>
              </li>
              <li className="skill-item">
                <span className="skill-num">04</span>
                <span className="skill-name">HTML5 / Semantic Web</span>
                <span className="skill-dot"></span>
              </li>
            </ul>
          </div>

          <div className="skills-category reveal-on-scroll delay-3">
            <h3 className="category-title">02 / Design & Creative</h3>
            <ul className="skills-list">
              <li className="skill-item">
                <span className="skill-num">05</span>
                <span className="skill-name">UI/UX Design Systems</span>
                <span className="skill-dot"></span>
              </li>
              <li className="skill-item">
                <span className="skill-num">06</span>
                <span className="skill-name">Figma prototyping</span>
                <span className="skill-dot"></span>
              </li>
              <li className="skill-item">
                <span className="skill-num">07</span>
                <span className="skill-name">Graphic Design & Vectors</span>
                <span className="skill-dot"></span>
              </li>
              <li className="skill-item">
                <span className="skill-num">08</span>
                <span className="skill-name">Typography & Layouts</span>
                <span className="skill-dot"></span>
              </li>
            </ul>
          </div>

          <div className="skills-category reveal-on-scroll delay-4">
            <h3 className="category-title">03 / Systems & Core</h3>
            <ul className="skills-list">
              <li className="skill-item">
                <span className="skill-num">09</span>
                <span className="skill-name">Android ROMs & AOSP</span>
                <span className="skill-dot"></span>
              </li>
              <li className="skill-item">
                <span className="skill-num">10</span>
                <span className="skill-name">C++ / Java development</span>
                <span className="skill-dot"></span>
              </li>
              <li className="skill-item">
                <span className="skill-num">11</span>
                <span className="skill-name">Git & Command Line</span>
                <span className="skill-dot"></span>
              </li>
              <li className="skill-item">
                <span className="skill-num">12</span>
                <span className="skill-name">Automation & Scripting</span>
                <span className="skill-dot"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
