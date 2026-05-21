import Link from "next/link";

interface TileProps {
  title: string;
  badge?: string;
  description: string;
  href: string;
  height?: number;
}

export function Tile({ title, badge, description, href, height = 220 }: TileProps) {
  return (
    <Link
      href={href}
      className="group kami-tile relative block overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <div className="flex h-full flex-col items-center justify-center text-center px-8 transition-opacity duration-300 group-hover:opacity-0">
        <h2 className="text-xl font-semibold kami-text">
          {title}
        </h2>
        {badge && (
          <p className="mt-1 text-sm kami-text-dim">
            {badge}
          </p>
        )}
      </div>
      <div className="kami-tile-overlay absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ lineHeight: "1.6" }}>
        <p className="mb-2 text-base font-semibold">{title}</p>
        <p className="text-[0.95rem] kami-text-overlay">{description}</p>
      </div>
    </Link>
  );
}
