
import { HugeiconsIcon, Mail01Icon, Linkedin01Icon, WhatsappIcon } from './icons';

interface ContactCardProps {
  picture: string;
  name: string;
  designation: string;
  email: string;
  linkedin: string;
  phone: string;
}

export default function ContactCard({ picture, name, designation, email, linkedin, phone }: ContactCardProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-w-sm hover:shadow-xl transition-shadow">
      <img 
        src={picture} 
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 left-4 right-4">
        <h3 className="text-xl font-bold text-white drop-shadow-2xl ">{name}</h3>
        <p className="text-white/90 drop-shadow-lg">{designation}</p>
      </div>
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 p-4 flex items-end"
        style={{
          mask: 'linear-gradient(transparent, black)',
          backdropFilter: 'blur(30px)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}
      >
        <div className="flex justify-center gap-4 w-full">
          <a href={`mailto:${email}`} className="text-white hover:text-brand-primary transition-colors">
            <HugeiconsIcon icon={Mail01Icon} size={24} />
          </a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-primary transition-colors">
            <HugeiconsIcon icon={Linkedin01Icon} size={24} />
          </a>
          <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-primary transition-colors">
            <HugeiconsIcon icon={WhatsappIcon} size={24} />
          </a>
        </div>
      </div>
    </div>
  );
}
