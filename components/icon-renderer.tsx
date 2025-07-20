import { cn } from "@/app/utils";

type IconRendererProps = {
  icon: React.ElementType | string;
  selected?: boolean;
  className?: string;
};

export const IconRenderer: React.FC<IconRendererProps> = ({
  icon,
  selected = false,
  className,
}) => {
  if (typeof icon === "string") {
    // Placeholder: later this can map the string to a real icon component
    return null;
  }

  const Icon = icon;

  return (
    <Icon
      className={cn(
        "hover:text-primary h-[22px] w-[22px] cursor-pointer text-black",
        selected && "text-primary",
        className,
      )}
    />
  );
};
