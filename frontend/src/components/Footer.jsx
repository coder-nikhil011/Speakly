import googlePlay from "../assets/google_play.jpeg";
import appStore from "../assets/app_store.jpeg";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/background_image.jpeg";

function Footer() {
  return (
    <footer>

      {/* IMAGE CTA SECTION */}
      <section id="footer"
        className="relative flex min-h-[650px] items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/35"></div>

        {/* Content */}
        <div className="relative z-10 px-6 text-center text-white">

          <h2 className="mx-auto max-w-3xl font-serif text-5xl font-bold leading-tight md:text-6xl">
            Your best learning
            <br />
            partner is already here
          </h2>

          <Link to="/signup" className="mt-12 inline-block w-80 rounded-full bg-white px-10 py-5 text-lg font-bold text-black transition hover:scale-105">
            Get started
          </Link>

          {/* App buttons */}
          <div className="mt-8 flex justify-center gap-5">

            <img
              src={googlePlay}
              className="h-14 w-auto"
            />

            <img
              src={appStore}
              alt="Download on the App Store"
              className="h-14 w-auto"
            />

          </div>

        </div>

      </section>


      {/* BLACK FOOTER */}
      <section className="bg-black px-8 pb-8 pt-20 text-white sm:px-12 lg:px-20">

        <div className="mx-auto max-w-[1500px]">

          <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">

            {/* Speakly */}
            <div>

              <h3 className="text-4xl font-bold tracking-tight">
                Speakly
              </h3>

              <p className="mt-5 max-w-xs text-sm leading-6 text-neutral-400">
                Your learning partner for real-life English.
              </p>

            </div>


            {/* Product */}
            <div>

              <h3 className="text-sm font-medium text-neutral-500">
                Product
              </h3>

              <ul className="mt-7 space-y-5 text-base">

                <li><a href="#features" className="text-white hover:text-slate-400">Features</a></li>
                <li><a href="#learn" className="text-white hover:text-slate-400">Word Mastery</a></li>
                <li><a href="#progress" className="text-white hover:text-slate-400">Smart Revision</a></li>
                <li><a href="#features" className="text-white hover:text-slate-400">Challenges</a></li>
                <li><a href="#progress" className="text-white hover:text-slate-400">Weakness Map</a></li>

              </ul>

            </div>


            {/* Solutions */}
            <div>

              <h3 className="text-sm font-medium text-neutral-500">
                Solutions
              </h3>

              <ul className="mt-7 space-y-5 text-base">

                <li><a href="#student" className="text-white hover:text-slate-400">For Students</a></li>
                <li><a href="#teacher" className="text-white hover:text-slate-400">For Teachers</a></li>
                <li><a href="#real-life" className="text-white hover:text-slate-400">Real-life English</a></li>

              </ul>

            </div>


            {/* Company */}
            <div>

              <h3 className="text-sm font-medium text-neutral-500">
                Company
              </h3>

              <ul className="mt-7 space-y-5 text-base">

                <li>About us</li>
                <li>Contact</li>
                <li>Careers</li>
                <li>Help Center</li>

              </ul>

            </div>


            {/* Behind Speakly */}
            <div>

              <h3 className="text-sm font-medium text-neutral-500">
                Behind Speakly
              </h3>

              <ul className="mt-7 space-y-5 text-base">

                <li><a href="#how" className="text-white hover:text-slate-400">How Speakly works</a></li>
                <li><a href="#speaking" className="text-white hover:text-slate-400">Learning with AI</a></li>
                <li><a href="#why" className="text-white hover:text-slate-400">Our approach to learning</a></li>

              </ul>

            </div>

          </div>


          {/* Social */}
          <div className="mt-20 flex justify-end gap-7 border-b border-neutral-800 pb-8">

            <span href="https://facebook.com" className="text-neutral-400">f</span>
            <span href="https://twitter.com" className="text-neutral-400">◎</span>
            <span href="https://twitter.com" className="text-neutral-400">𝕏</span>
            <span href="https://linkedin.com" className="text-neutral-400">in</span>

          </div>


          {/* Bottom */}
          <div className="flex flex-col gap-5 pt-8 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">

            <div className="flex flex-wrap gap-7">

              <span>Terms of service</span>
              <span>Privacy policy</span>
              <span>Cookie policy</span>
              <span>Accessibility</span>

            </div>

            <p>
              © 2026 Speakly. All rights reserved.
            </p>

          </div>

        </div>

      </section>

    </footer>
  );
}

export default Footer;