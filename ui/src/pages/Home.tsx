import { useState, useEffect } from "react";
import { CampaignCard, DonationModal } from "../components";
import { Heart, Search, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { ConnectButton, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME, MIST_PER_SUI } from "../utility/constants";
import { Link } from "react-router-dom";

const heroSlides = [
  {
    id: 1,
    stat: "1,240",
    label: "Lives Saved",
    image:
      "https://images.unsplash.com/photo-1628087730636-ac461db242fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: 2,
    stat: "320",
    label: "Medical Procedures Funded",
    image:
      "https://images.unsplash.com/photo-1616408621653-6755190009a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: 3,
    stat: "85",
    label: "Schools Built",
    image:
      "https://images.unsplash.com/photo-1666281269793-da06484657e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

const campaigns = [
  {
    id: "0x935d44617d99a0953edbe650119a8523ea346a14d6a341a759006fe073b9d766",
    title: "Save the Stray Dogs Shelter",
    description:
      "Our local shelter has run out of food and medicine supplies. We need your support to prevent the eviction of over 200 dogs.",
    imageUrl:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1080",
    targetAmount: 0.3,
    collectedAmount: 0,
    isCritical: true,
    category: "#Community",
    company: "wwf.org",
  },

  {
    id: "0x934aa467e193273a81e61d83a7bae81684594f74150ebaa06884ae2b4fd9f1a8",
    title: "Heart Surgery for Baby Ali",
    description:
      "Baby Ali was born with a congenital heart defect and needs urgent surgery. Insurance doesn't cover the costs, and we are running out of time.",
    imageUrl:
      "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&q=80&w=1080",
    targetAmount: 0.3,
    collectedAmount: 0,
    isCritical: true,
    category: "#Medical",
    company: "unicef.org",
  },

  {
    id: "0xba1915d886254e82b603efcdee4536d3d1239457d17966bb91b1081d924ed90a",
    title: "Tech Classrooms for Village Schools",
    description:
      "We are setting up computer labs in 5 rural schools. Support us to introduce 200 students to coding and the internet.",
    imageUrl:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1080",
    targetAmount: 0.1,
    collectedAmount: 0,
    isCritical: false,
    category: "#Education",
    company: "asanteafrica.org",
  },

  {
    id: "0xf977c11762152a61debd8bea4bb8aa2db78d14b9400c186499224006d1b60312",
    title: "Emergency Relief for Earthquake Victims",
    description:
      "As winter approaches, we are setting up heated container homes for families staying in tents. Be a warm home for a family.",
    imageUrl:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1080",
    targetAmount: 0.1,
    collectedAmount: 0,
    isCritical: true,
    category: "#Emergency",
    company: "redcross.org",
  },

  {
    id: "0x122050c9265f5de185f48ce9d2099413a825d11d0626c6a0ec4e8e3df4213716",
    title: "Breath for the Future: 10,000 Saplings",
    description:
      "We are re-greening our burnt forests. For every 1 SUI you donate, we plant 5 saplings back into nature.",
    imageUrl:
      "https://images.unsplash.com/photo-1457530378978-8bac673b8062?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    targetAmount: 0.1,
    collectedAmount: 0,
    isCritical: false,
    category: "#Community",
    company: "nature.org",
  },

  {
    id: "0xc8a1f3c09a50e12b30242cb7c0b68d428c7354106c13223f215551b5799a9453",
    title: "Pediatric Cancer Research Fund",
    description:
      "We support innovative treatments for rare pediatric cancers. 100% of donations go directly to research labs.",
    imageUrl:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1080",
    targetAmount: 0.1,
    collectedAmount: 0,
    isCritical: false,
    category: "#Medical",
    company: "curesearch.org",
  },
];
const filterTags = [
  "#All",
  "#Emergency",
  "#Children",
  "#Medical",
  "#Education",
  "#Community",
];

interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  collectedAmount: number;
  isCritical: boolean;
  category: string;
  company: string;
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("#All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  const createTestCampaign = () => {
    const tx = new Transaction();
    const targetMist = 0.1 * MIST_PER_SUI;

    const hospitalAddress =
      "0xd88ce71c10cc9a5117f689c4e40a306bf331e647b04c80e804bbb75acc306fcd";

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_campaign`,
      arguments: [tx.pure.u64(targetMist), tx.pure.address(hospitalAddress)],
    });

    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          const createdObject = result.effects?.created?.find(
            (item) => item.owner.Shared,
          );
          console.log("Campaign created, result:", result);

          if (createdObject) {
            alert(`Campaign ID Created: ${createdObject.reference.objectId}`);
          }
        },
      },
    );
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesFilter =
      activeFilter === "#All" || campaign.category === activeFilter;
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDonationSuccess = () => {
    setSelectedCampaign(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {selectedCampaign && (
        <DonationModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onDonateSuccess={handleDonationSuccess}
        />
      )}

      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                BlockCharity
              </span>
            </Link>

            {/* <button
              onClick={createTestCampaign}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-lg z-50 relative ml-4"
            >
              TEST: Create Campaign
            </button> */}

            {/* Create Campaign Button */}

            <a
              href="mailto:info@blockcharity.com"
              className="ml-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all"
            >
              Create Request
            </a>

            <div className="absolute right-6 flex items-center gap-4">
              <Link
                to="/about-us"
                className="text-white hover:text-blue-300 font-medium transition-colors"
              >
                About Us
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <section className="relative h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <div
              className="relative h-[600px] bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(${slide.image})`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-7xl mb-4 font-bold">{slide.stat}</div>
                  <div className="text-3xl">{slide.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="relative -mt-20 z-30 max-w-5xl mx-auto px-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/40">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6 justify-center">
            <div className="flex items-center gap-4 w-full max-w-4xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl">
                Search
              </button>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === tag
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              {...campaign}
              onDonateClick={() => setSelectedCampaign(campaign)}
            />
          ))}
        </div>
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-20 text-gray-500 text-xl">
            No campaigns found matching your criteria.
          </div>
        )}
      </section>

      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600 fill-blue-600" />
              <span className="text-xl text-gray-800">BlockCharity</span>
            </div>
            <div className="text-gray-600 text-center md:text-right">
              <p>We are here to make the world a better place.</p>
              <p className="mt-2">© 2025 BlockCharity. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
