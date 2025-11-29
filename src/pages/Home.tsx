import { useState, useEffect } from "react";
import { CampaignCard, DonationModal } from "../components";
import { Heart, Search, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
import { ConnectButton, useAccounts } from "@mysten/dapp-kit";

const heroSlides = [
  {
    id: 1,
    stat: "1,240",
    label: "Lives Saved",
    image:
      "https://images.unsplash.com/photo-1628087730636-ac461db242fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHNtaWxpbmclMjBjaGlsZCUyMGhvcGV8ZW58MXx8fHwxNzY0NDA1NTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 2,
    stat: "320",
    label: "Medical Procedures Funded",
    image:
      "https://images.unsplash.com/photo-1616408621653-6755190009a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2FyZSUyMGNoaWxkcmVufGVufDF8fHx8MTc2NDQwNTUxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 3,
    stat: "85",
    label: "Schools Built",
    image:
      "https://images.unsplash.com/photo-1666281269793-da06484657e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBjaGlsZHJlbiUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NjQ0MDU1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

const campaigns = [
  {
    id: "1",
    title: "Emergency Heart Surgery for 8-Year-Old",
    description:
      "Young Maria needs urgent cardiac surgery to repair a congenital heart defect.",
    imageUrl:
      "https://images.unsplash.com/photo-1616408621653-6755190009a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2FyZSUyMGNoaWxkcmVufGVufDF8fHx8MTc2NDQwNTUxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    targetAmount: 20000,
    collectedAmount: 14500,
    isCritical: true,
    category: "#Medical",
  },
  {
    id: "2",
    title: "Clean Water for Rural Community",
    description:
      "Install water filtration systems for 500 families in need of clean drinking water.",
    imageUrl:
      "https://images.unsplash.com/photo-1528566401806-917f86c1fc2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTIwY29tbXVuaXR5fGVufDF8fHx8MTc2NDQwNTUxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    targetAmount: 15000,
    collectedAmount: 8200,
    isCritical: false,
    category: "#Urgent",
  },
  {
    id: "3",
    title: "Education Fund for Orphans",
    description:
      "Provide school supplies and tuition for 100 children who lost their parents.",
    imageUrl:
      "https://images.unsplash.com/photo-1666281269793-da06484657e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBjaGlsZHJlbiUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NjQ0MDU1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    targetAmount: 12000,
    collectedAmount: 9800,
    isCritical: false,
    category: "#Children",
  },
  {
    id: "4",
    title: "Cancer Treatment Support",
    description:
      "Help fund chemotherapy and radiation therapy for pediatric cancer patients.",
    imageUrl:
      "https://images.unsplash.com/photo-1628087730636-ac461db242fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHNtaWxpbmclMjBjaGlsZCUyMGhvcGV8ZW58MXx8fHwxNzY0NDA1NTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    targetAmount: 25000,
    collectedAmount: 11200,
    isCritical: true,
    category: "#Medical",
  },
  {
    id: "5",
    title: "Emergency Food Relief Program",
    description:
      "Distribute food packages to families affected by recent natural disasters.",
    imageUrl:
      "https://images.unsplash.com/photo-1528566401806-917f86c1fc2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTIwY29tbXVuaXR5fGVufDF8fHx8MTc2NDQwNTUxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    targetAmount: 18000,
    collectedAmount: 15600,
    isCritical: false,
    category: "#Urgent",
  },
  {
    id: "6",
    title: "Build Playground for Children",
    description:
      "Create a safe outdoor play area for kids in an underserved neighborhood.",
    imageUrl:
      "https://images.unsplash.com/photo-1666281269793-da06484657e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBjaGlsZHJlbiUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NjQ0MDU1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    targetAmount: 10000,
    collectedAmount: 6500,
    isCritical: false,
    category: "#Children",
  },
];

const filterTags = [
  "#All",
  "#Urgent",
  "#Children",
  "#Medical",
  "#Education",
  "#Community",
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("#All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const accounts = useAccounts();
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

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesFilter =
      activeFilter === "#All" || campaign.category === activeFilter;
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleConfirmDonation = (amount) => {
    console.log(
      `Donating ${amount} SUI to campaign ${selectedCampaign?.title}`,
    );
    // BURADA İLERİDE SUI BLOKZİNCİR İŞLEMİNİ ÇAĞIRACAĞIZ

    // İşlem bitince modalı kapat
    setSelectedCampaign(null);
    alert(`Thank you! You donated ${amount} SUI.`);
  };

  return (
    <div className="min-h-screen bg-white">
      {selectedCampaign && (
        <DonationModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onDonate={handleConfirmDonation}
        />
      )}
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-blue-600 fill-blue-600" />
              <span className="text-2xl text-white drop-shadow-lg">
                HelpChain
              </span>
            </div>
            <div className="absolute right-6">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Slider */}
      <section className="relative h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="relative h-[600px] bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-7xl mb-4" style={{ fontWeight: 700 }}>
                    {slide.stat}
                  </div>
                  <div className="text-3xl">{slide.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all z-10 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all z-10 backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
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

      {/* Search & Filter Section */}
      <section className="relative -mt-20 z-30 max-w-5xl mx-auto px-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/40">
          {/* Search Input */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6 justify-center">
            <div className="flex items-center gap-4 w-full max-w-4xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl transition-all shadow-sm hover:shadow-md shrink-0">
                {" "}
                Search
              </button>
            </div>

            {/* Filter Tags */}
            <div className="flex gap-3 flex-wrap justify-center md:justify-start">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === tag
                      ? "bg-blue-600 text-white shadow-md"
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

      {/* Campaign Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              {...campaign}
              onDonateClick={(camp) => setSelectedCampaign(camp)}
            />
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">
              No campaigns found matching your criteria.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600 fill-blue-600" />
              <span className="text-xl text-gray-800">HelpChain</span>
            </div>

            <div className="text-gray-600 text-center md:text-right">
              <p>Making the world a better place, one transaction at a time.</p>
              <p className="mt-2">© 2025 HelpChain. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
