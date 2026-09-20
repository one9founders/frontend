import { permanentRedirect } from 'next/navigation';

/** Legacy path — permanent redirect also declared in next.config.ts. */
export default function CampusInternshipPage() {
  permanentRedirect('/internship');
}
