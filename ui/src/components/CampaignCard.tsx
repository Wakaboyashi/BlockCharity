import { Heart, RefreshCcw, Ban, Trash2 } from "lucide-react";
import {
  useSuiClient,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME, MIST_PER_SUI } from "../utility/constants";

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  isCritical: boolean;
  category: string;
  company: string;
  onDonateClick: (campaign: any) => void;
}

export default function CampaignCard({
  id,
  title,
  description,
  imageUrl,
  targetAmount,
  company,
  category,
  onDonateClick,
}: CampaignCardProps) {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [collectedAmount, setCollectedAmount] = useState(0);
  const [status, setStatus] = useState<number>(0);
  const [creatorAddress, setCreatorAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!id.startsWith("0x")) {
        setIsLoading(false);
        return;
      }

      try {
        const objectData = await client.getObject({
          id: id,
          options: { showContent: true },
        });

        if (objectData.data?.content?.dataType === "moveObject") {
          const fields = objectData.data.content.fields;

          setCollectedAmount(Number(fields.current_amount) / MIST_PER_SUI);
          setStatus(fields.status);
          setCreatorAddress(fields.creator);
        }
      } catch (error) {
        console.error("Data error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
    const interval = setInterval(fetchCampaignData, 10000);
    return () => clearInterval(interval);
  }, [client, id]);

  const isOwner = currentAccount?.address === creatorAddress;

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to cancel this campaign?")) return;

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::cancel_campaign`,
      arguments: [tx.object(id)],
    });

    signAndExecuteTransaction(
      { transaction: tx },
      {
        onSuccess: () => alert("Campaign cancelled."),
        onError: (err) => alert("Cancellation failed."),
      },
    );
  };

  const handleRefund = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::claim_refund`,
      arguments: [tx.object(id)],
    });

    signAndExecuteTransaction(
      { transaction: tx },
      {
        onSuccess: () => alert("Refund claimed! Check your wallet."),
        onError: (err) =>
          alert("Refund failed (No donation found or already claimed)."),
      },
    );
  };

  const percentage =
    targetAmount > 0
      ? Math.min((collectedAmount / targetAmount) * 100, 100)
      : 0;

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 group flex flex-col h-full relative
      ${status === 2 ? "bg-red-50 border-red-200" : "bg-white border-gray-100 hover:shadow-xl"}`}
    >
      {/* CANCELLED OVERLAY */}
      {status === 2 && (
        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-red-100 p-4 rounded-full mb-3">
            <Ban className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-700">Cancelled</h3>
          <p className="text-sm text-gray-600 mb-4 max-w-[200px]">
            Donations have stopped. You can claim a refund.
          </p>

          <button
            onClick={handleRefund}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 shadow-lg animate-bounce"
          >
            <RefreshCcw className="w-4 h-4" /> Claim Refund
          </button>
        </div>
      )}

      <div className="relative h-56 overflow-hidden grayscale-0">
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 ${status === 2 ? "grayscale opacity-50" : "group-hover:scale-105"}`}
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
          {company}
        </div>
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
          {category}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {title}
        </h3>

        <div className="mb-4">
          <div className="flex justify-between text-sm font-semibold mb-2">
            <span className={status === 2 ? "text-gray-500" : "text-blue-600"}>
              {isLoading ? "..." : `${collectedAmount.toLocaleString()} SUI`}
            </span>
            <span className="text-gray-400">
              of {targetAmount.toLocaleString()} SUI
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${status === 2 ? "bg-gray-400" : "bg-blue-600"}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          {status === 0 && (
            <button
              onClick={() =>
                onDonateClick({ id, title, category, imageUrl, description })
              }
              className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Donate Now <Heart className="w-4 h-4" />
            </button>
          )}

          {status === 0 && isOwner && (
            <button
              onClick={handleCancel}
              className="w-full flex items-center justify-center gap-2 text-xs text-red-500 hover:text-white font-bold py-2 border border-red-200 hover:bg-red-500 hover:border-red-500 rounded-lg transition-all"
            >
              <Trash2 className="w-3 h-3" />
              Admin: Cancel Campaign
            </button>
          )}

          {status === 1 && (
            <div className="w-full bg-green-100 text-green-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
              ✅ Goal Reached!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
