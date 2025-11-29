import {
  Heart,
  Github,
  Linkedin,
  Mail,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Globe,
  Code2,
  Database,
  Cpu,
  Palette,
} from "lucide-react";
import { Link } from "react-router-dom";

const teamMembers = [
  {
    id: 1,
    name: "Mustafa Ula",
    role: "Lead Blockchain Architect",
    description:
      "Deep expertise in the Sui ecosystem. Designing secure smart contract architectures.",
    image:
      "https://cdn.intra.42.fr/users/27903775710ede6976eafeafa1697196/mula.jpg",

    social: {
      github: "https://github.com/MustafaUla",
      linkedin: "https://www.linkedin.com/in/mustafa-ula-384939317",
      email: "mailto:mustafaula2802@gmail.com",
    },
  },
  {
    id: 2,
    name: "Melih Yıldız",
    role: "Senior Full Stack Dev",
    description:
      "Developing high-performance React interfaces focused on user experience (UX).",
    image:
      "https://cdn.intra.42.fr/users/c992e4df8e5bebf764536338d2436759/melihyil.jpg",
    social: {
      github: "https://github.com/Wakaboyashi",
      linkedin: "https://www.linkedin.com/in/melihyil/",
      email: "mailto:my20045252@gmail.com",
    },
  },
  {
    id: 3,
    name: "Serra Keskin",
    role: "Product & Design Lead",
    description:
      "Determining the strategic direction of the project with a vision combining technology and social benefit.",
    image:
      "https://cdn.intra.42.fr/users/4c4b1b0f5186e6c124d6d61a4d33d481/sekeskin.jpg",
    social: {
      github: "https://github.com/serrakskn",
      linkedin: "https://www.linkedin.com/in/serra-keskin-41522329b/",
      email: "mailto:serrakeskin@gmail.com",
    },
  },
];

export default function AboutUs() {
  return (
    <div className="w-full min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              BlockCharity
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-all px-4 py-2 rounded-full hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden w-full flex flex-col items-center text-center">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        ></div>

        <div className="max-w-7xl mx-auto w-full">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-bold tracking-wide uppercase mb-6">
            Our Story
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
            Redefining <span className="text-blue-600">Charity</span> with{" "}
            <br />
            Blockchain.
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            We are eliminating trust issues in traditional donation systems.
            Leveraging the power of the Sui network, we are laying the
            foundations for a transparent future where the destination of every
            penny is verifiable.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Radical Transparency
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Every donation, transfer, and expenditure can be tracked directly
              on-chain.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Light-Speed Transfer
            </h3>
            <p className="text-slate-600 leading-relaxed">
              With the Sui network, aid reaches those in need within seconds.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Code Assurance
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Smart contracts guarantee that your donation is used exactly as
              intended.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="bg-slate-900 py-24 my-16 relative overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Tech Stack
            </h2>
            <p className="text-slate-300 text-lg">
              We use the most modern technologies to ensure a secure and
              scalable platform.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Code2 />, title: "Sui Move", desc: "Smart Contracts" },
              { icon: <Cpu />, title: "React", desc: "Frontend Core" },
              { icon: <Database />, title: "TypeScript", desc: "Type Safety" },
              { icon: <Palette />, title: "Tailwind", desc: "Styling Engine" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl text-center hover:bg-white/10 transition-colors group flex flex-col items-center"
              >
                <div className="w-12 h-12 mx-auto bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 w-full flex flex-col items-center">
        <div className="text-center mb-16 w-full">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Team</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Meet the passionate developers and designers who brought this
            project to life.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 justify-items-center">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group flex flex-col items-center max-w-sm"
            >
              <div className="relative overflow-hidden rounded-2xl mb-6 shadow-2xl w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-[4/5] object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-slate-900 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.email}
                    className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-red-500 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 mb-20 w-full">
        <div className="bg-blue-600 rounded-3xl p-12 text-center text-white relative overflow-hidden flex flex-col items-center">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Be Part of the Change
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              A small donation, combined with transparent technology, can change
              the world.
            </p>
            <Link
              to="/"
              className="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
            >
              Start Donating
            </Link>
          </div>

          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 w-full">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              BlockCharity
            </span>
          </div>
          <p className="text-center">
            © 2025 BlockCharity. Trustless Charity Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
