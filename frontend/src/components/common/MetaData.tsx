
import { Helmet, HelmetProvider } from "react-helmet-async";

interface MetaDataBody {
  title: string;
}

const MetaData = ({ title }: MetaDataBody) => {
  return (
    <HelmetProvider>
      <Helmet title={title} />
    </HelmetProvider>
  );
};

export default MetaData;
