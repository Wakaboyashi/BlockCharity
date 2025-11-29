import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  collectedAmount: number;
  isCritical?: boolean;
  category: string;
  onDonateClick: (data: {
    id: string;
    title: string;
    category: string;
  }) => void;
}
export default function CampaignCard({
  id,
  title,
  description,
  imageUrl,
  targetAmount,
  collectedAmount,
  isCritical = false,
  category,
  onDonateClick,
}: CampaignCardProps) {
  const percentage = (collectedAmount / targetAmount) * 100;

  return (
    <div
      className="bg-white rounded-lg overflow-hidden relative"
      style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
    >
      {isCritical && (
        <div
          className="absolute top-0 right-0 bg-red-600 text-white px-4 py-2 z-10"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 8px 50%)",
            paddingLeft: "20px",
          }}
        >
          Critical Time Window
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6">
        <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full mb-3">
          {category}
        </div>

        <h3 className="mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>

        <div className="mb-3">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Collected</span>
            <span className="text-blue-600">
              {collectedAmount.toLocaleString()} USDT
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Target</span>
            <span className="text-gray-900">
              {targetAmount.toLocaleString()} USDT
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>

          <div className="mt-2 text-sm text-gray-500">
            {percentage.toFixed(0)}% funded
          </div>
        </div>

        <button
          onClick={() => onDonateClick({ id, title, category })} // <--- Butona tıklandığında veriyi yukarı at
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors mt-4"
        >
          Donate Now
        </button>
      </div>
    </div>
  );
}
