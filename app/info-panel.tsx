import { cn } from "./utils";
import { pageConfig } from "./config";
import { BsGearFill } from "react-icons/bs";

interface Props {
  className?: string;
}

const InfoPanel = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "border-primary/10 bg-glass/20 relative flex flex-col gap-6 rounded-xl border p-6",
        "shadow-[0_2px_6px_rgba(1,42,74,0.15),_0_6px_12px_rgba(1,42,74,0.2),_0_12px_24px_rgba(1,42,74,0.25),_0_20px_32px_rgba(1,42,74,0.2),_0_32px_48px_rgba(1,42,74,0.15)]",
        "text-primary min-w-[300px] backdrop-blur-[6px] lg:flex lg:flex-1",
        className,
      )}
      style={{
        height: "max-content",
        overflow: "hidden",
      }}
    >
      <h2 className="text-3xl font-semibold">Implementation Notes</h2>
      <div className="border-primary/10 space-y-6 overflow-y-auto border-b-1 pr-2 text-base">
        {pageConfig.infoSections.map(({ title, description }) => (
          <div key={title}>
            <h3 className="text-primary text-lg font-semibold">{title}</h3>
            <p className="text-secondary mt-1">{description}</p>
          </div>
        ))}
        <div>
          View code on GitHub –{" "}
          <a
            href="https://github.com/somani09/tanstack-table-on-steroids"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            https://github.com/somani09/tanstack-table-on-steroids
          </a>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
