import { forwardRef } from "react";
import { IgalaName } from "@/types/names";

interface NameImageCardProps {
  name: IgalaName;
}

const NameImageCard = forwardRef<HTMLDivElement, NameImageCardProps>(
  ({ name }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[400px] h-[500px] p-8 flex flex-col justify-between"
        style={{
          background: "linear-gradient(135deg, #5c7e26 0%, #e9982f 50%, #e34e35 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header */}
        <div className="text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <span className="text-white/90 text-sm font-medium">
              {name.category} • {name.gender === "male" ? "♂" : name.gender === "female" ? "♀" : "⚥"}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center flex-grow flex flex-col justify-center">
          <h1
            className="text-6xl font-bold text-white mb-4 drop-shadow-lg"
            style={{ fontFamily: "serif" }}
          >
            {name.name}
          </h1>
          <p className="text-white/80 italic mb-6 text-lg">/{name.pronunciation}/</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mx-auto max-w-[320px]">
            <p className="text-white text-xl font-semibold">"{name.meaning}"</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white/70 text-sm mb-2">
            {name.origin_story.slice(0, 80)}...
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-8 h-1 bg-white/40 rounded-full" />
            <span className="text-white/90 text-sm font-semibold tracking-wide">
              Igala Names
            </span>
            <div className="w-8 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>
    );
  }
);

NameImageCard.displayName = "NameImageCard";

export default NameImageCard;
