import {
  X,
  Heart,
  Clock,
  ShieldCheck,
  User,
  ExternalLink,
  CheckCircle,
  Code,
} from "lucide-react";
import { useState, useEffect } from "react";

import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

import {
  PACKAGE_ID,
  MODULE_NAME,
  MIST_PER_SUI,
  EVENT_DONATION_RECEIVED,
} from "../utility/constants";

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Donation Successful!
          </h2>
          <p className="text-gray-500 text-sm">Thank you for your support.</p>
          <button
            onClick={onClose}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DonationModal({
  campaign,
  onClose,
  onDonateSuccess,
}: any) {
  // ... (State'ler ve useEffect aynı) ...
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  const client = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  if (!campaign) return null;
  const quickAmounts = [10, 50, 100, 500];

  // ... (useEffect ve handleDonate fonksiyonları AYNI kalacak, buraya kopyalamıyorum yer kaplamasın) ...
  useEffect(() => {
    const fetchLogs = async () => {
      if (!campaign?.id || !campaign.id.startsWith("0x")) {
        setLogs([]);
        setIsLoadingLogs(false);
        return;
      }

      try {
        const events = await client.queryEvents({
          query: { MoveEventType: EVENT_DONATION_RECEIVED },
          limit: 10,
          order: "descending",
        });

        const filteredLogs = events.data
          .filter((e: any) => e.parsedJson.campaign_id === campaign.id)
          .map((event: any) => ({
            id: event.id.txDigest,
            donor: event.parsedJson.donor,
            amount: Number(event.parsedJson.amount) / MIST_PER_SUI,
            time: "recent",
          }));

        setLogs(filteredLogs);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingLogs(false);
      }
    };

    fetchLogs();
  }, [campaign.id]);

  const handleDonate = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setIsProcessing(true);

    try {
      const txb = new Transaction();
      const amountInMist = BigInt(parseFloat(amount) * MIST_PER_SUI);

      const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(amountInMist)]);

      txb.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::donate`,
        arguments: [txb.object(campaign.id), coin],
      });

      signAndExecuteTransaction(
        { transaction: txb },
        {
          onSuccess: () => {
            setIsProcessing(false);
            setShowSuccess(true);
            onDonateSuccess();
          },
          onError: () => {
            setIsProcessing(false);
          },
        },
      );
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        {/* ... (Arka plan aynı) ... */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row max-h-[90vh]">
          {/* ... (Kapat butonu aynı) ... */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 bg-white/50 hover:bg-white text-gray-800 p-2 rounded-full md:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* SOL KOLON */}
          <div className="w-full md:w-3/5 overflow-y-auto custom-scrollbar bg-white">
            {/* Görsel (Aynı) */}
            <div className="relative h-64 sm:h-80 w-full">
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent w-full">
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-2">
                  {campaign.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {campaign.title}
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* --- GÜNCELLENEN KISIM: KONTARAT BİLGİSİ --- */}
              <div className="flex flex-col gap-3">
                {/* Verified Kutusu */}
                <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-bold uppercase">
                      Verified Recipient
                    </p>
                    <p className="font-semibold text-gray-900">
                      Campaign Vault
                    </p>
                  </div>
                </div>

                {/* Kontrat Linki */}
                {campaign.id.startsWith("0x") && (
                  <a
                    href={`https://suiscan.xyz/testnet/object/${campaign.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Code className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                          Smart Contract
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {campaign.id.slice(0, 10)}...{campaign.id.slice(-6)}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                  </a>
                )}
              </div>

              {/* Açıklama ve Loglar (Aynı Kalıyor) */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Campaign Story
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {campaign.description}
                </p>
              </div>

              {/* ... (Log Kısmı Aynen Kalıyor) ... */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" /> Recent Donations
                </h3>
                {isLoadingLogs ? (
                  <div className="text-center py-6 text-gray-400">
                    Loading...
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-sm">No donations yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">
                              {log.donor.slice(0, 6)}...{log.donor.slice(-4)}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900">
                          +{log.amount} SUI
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SAĞ KOLON (Ödeme Formu - Aynı Kalıyor) */}
          <div className="w-full md:w-2/5 bg-gray-50 p-8 flex flex-col border-l">
            {/* ... (Bu kısımlarda değişiklik yok) ... */}
            <button
              onClick={onClose}
              className="hidden md:block absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Make a Donation
                </h3>
                <p className="text-gray-500 text-sm">
                  100% goes to the verified wallet.
                </p>
              </div>
              <div className="bg-white p-2 rounded-xl border mb-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-3xl font-bold p-4 focus:outline-none text-gray-900 placeholder-gray-300"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 mb-8">
                {quickAmounts.map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className={`py-2 rounded-lg border text-sm font-semibold ${amount === val.toString() ? "bg-blue-600 text-white" : "bg-white text-gray-600 border-gray-300"}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <button
                onClick={handleDonate}
                disabled={!amount || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-xl disabled:opacity-50 transition"
              >
                {isProcessing ? "Processing..." : "Confirm Donation"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessModal
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
