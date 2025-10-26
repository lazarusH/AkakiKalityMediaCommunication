import { useParams } from 'react-router-dom';
import InstitutionTemplate from './InstitutionTemplate';

const DynamicInstitution = () => {
  const { slug } = useParams();

  return (
    <InstitutionTemplate
      slug={slug}
      // Fallback title and description in case database fetch fails
      title="እየጫነ ነው..."
      description=""
      type="office"
    />
  );
};

export default DynamicInstitution;

