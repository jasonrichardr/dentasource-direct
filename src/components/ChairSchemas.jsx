import JsonLd from './JsonLd';
import { chairSchemas } from '@/lib/schemas/chairPages';

export default function ChairSchemas({ route }) {
  const schemas = chairSchemas(route);
  if (!schemas) return null;
  const idSuffix = route.replace(/[^a-zA-Z0-9]/g, '-').replace(/^-+/, '');
  return (
    <>
      <JsonLd id={`chair-product-${idSuffix}`} data={schemas.product} />
      <JsonLd id={`chair-breadcrumb-${idSuffix}`} data={schemas.breadcrumb} />
    </>
  );
}
