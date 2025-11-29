import {
  X,
  Wallet,
  Heart,
  Clock,
  ShieldCheck,
  User,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

interface DonationModalProps {
  campaign: string;
  OnClose: Boolean;
  onDonate: (amount: number) => void;
}

// Örnek sahte veri (Loglar için)
const recentDonations = [
  { id: 1, donor: "0x71...3a92", amount: 150, time: "2 dk önce" },
  { id: 2, donor: "0x89...b1c4", amount: 50, time: "5 dk önce" },
  { id: 3, donor: "0x12...9f88", amount: 1200, time: "12 dk önce" },
  { id: 4, donor: "0x44...11aa", amount: 25, time: "1 saat önce" },
  { id: 5, donor: "0x99...22bb", amount: 100, time: "3 saat önce" },
];

export const DonationModal = ({
  campaign,
  onClose,
  onDonate,
}: DonationModalProps) => {
  const [amount, setAmount] = useState("");

  if (!campaign) return null;

  const quickAmounts = [10, 50, 100, 500];

  const handleDonate = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    onDonate(amount);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* 1. Arka Plan Karartma (Overlay) */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* 2. Modal Ana Kapsayıcı (Genişletildi: max-w-5xl) */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row max-h-[90vh]">
        {/* Kapat Butonu (Mobilde üstte, masaüstünde sağda absolute değil, layout dışı) */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 bg-white/50 hover:bg-white text-gray-800 p-2 rounded-full backdrop-blur-md transition-all md:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- SOL KOLON: Detaylar ve Loglar (%60 Genişlik) --- */}
        <div className="w-full md:w-3/5 overflow-y-auto custom-scrollbar bg-white">
          {/* Görsel Alanı */}
          <div className="relative h-64 sm:h-80 w-full">
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-2">
                {campaign.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {campaign.title}
              </h2>
            </div>
          </div>

          {/* İçerik Alanı */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Güven Rozeti & Beneficiary */}
            <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="bg-blue-100 p-3 rounded-full">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">
                  Verified Recipient
                </p>
                <p className="font-semibold text-gray-900">
                  Boston Children's Hospital Wallet
                </p>
                <p className="text-xs text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                  0x71C...9A2 <ExternalLink className="w-3 h-3" />
                </p>
              </div>
            </div>

            {/* Açıklama */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Campaign Story
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {campaign.description}
                {/* Uzun metin simülasyonu */}
                <span className="block mt-2">
                  This funding will directly support the operational costs,
                  medication, and post-surgery rehabilitation. Every transaction
                  is transparently recorded on the Sui blockchain, ensuring your
                  help reaches the right hands instantly.
                </span>
              </p>
            </div>

            {/* Bağış Geçmişi (Logs) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  Recent Donations
                </h3>
                <span className="text-sm text-green-600 font-medium animate-pulse">
                  ● Live Updates
                </span>
              </div>

              <div className="space-y-3">
                {recentDonations.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 font-mono">
                          {log.donor}
                        </p>
                        <p className="text-xs text-gray-400">{log.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-gray-900">
                        +{log.amount} SUI
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium border border-gray-200 rounded-lg">
                View All Transactions on Explorer
              </button>
            </div>
          </div>
        </div>

        {/* --- SAĞ KOLON: Ödeme Formu (%40 Genişlik) --- */}
        <div className="w-full md:w-2/5 bg-gray-50 p-6 sm:p-8 flex flex-col border-l border-gray-100 relative">
          {/* Desktop Close Button */}
          <button
            onClick={onClose}
            className="hidden md:block absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <Heart className="w-6 h-6 text-blue-600 fill-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Make a Donation
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                100% of funds go to the verified wallet.
              </p>
            </div>

            {/* Input Area */}
            <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm mb-4">
              <div className="relative">
                <label className="absolute left-4 top-2 text-xs font-semibold text-gray-400">
                  Enter Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-4 pr-16 pt-6 pb-2 text-3xl font-bold text-gray-900 bg-transparent rounded-xl focus:outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <img
                    src="https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg"
                    alt="Sui"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-bold text-gray-600">SUI</span>
                </div>
              </div>
            </div>

            {/* Quick Select */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className={`py-2 px-1 rounded-lg text-sm font-semibold transition-all border ${
                    amount === val.toString()
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>

            {/* Wallet Info & Action */}
            <div className="mt-auto">
              <div className="flex justify-between items-center mb-4 text-sm bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <span className="text-gray-500">Available Balance:</span>
                <span className="font-bold text-gray-900 flex items-center gap-1">
                  <Wallet className="w-4 h-4 text-blue-500" />
                  1,240.50 SUI
                </span>
              </div>

              <button
                onClick={handleDonate}
                disabled={!amount}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Confirm Donation
              </button>

              <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Secure Payment via Sui Blockchain
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
