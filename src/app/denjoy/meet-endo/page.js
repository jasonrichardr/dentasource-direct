import { getFlagship } from '@/data/denjoy';
import MeetEndoDetail from '@/components/denjoy/MeetEndoDetail';

export function generateMetadata() {
  const product = getFlagship();
  return {
    title: `${product.fullName} — DentaSource Direct`,
    description: product.tagline,
  };
}

export default function MeetEndoPage() {
  return <MeetEndoDetail />;
}
