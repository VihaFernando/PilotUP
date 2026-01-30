import { Instagram, Linkedin, Youtube } from 'lucide-react';

const LINKS = [
  { Icon: Instagram, href: 'https://www.instagram.com/thepilotup', label: 'Instagram' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/company/pilotup/', label: 'LinkedIn' },
  { Icon: Youtube, href: 'https://www.youtube.com/@thepilotup', label: 'Youtube' },
];

export default function CountdownSocialIcons() {
  return (
    <div className="flex items-center gap-3">
      {LINKS.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#E21339] hover:text-white transition-colors"
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}
