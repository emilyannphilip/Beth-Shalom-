import Link from "next/link";

export interface NavigationItem {
  href: string;
  label: string;
}

interface NavigationProps {
  label: string;
  items: readonly NavigationItem[];
}

export function Navigation({ label, items }: NavigationProps) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {items.map(({ href, label: text }) => (
          <li key={href}>
            <Link href={href} className="underline underline-offset-4">{text}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
