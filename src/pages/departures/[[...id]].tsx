import DefaultLayout from '@atb/layouts/default';
import type { WithGlobalData } from '@atb/layouts/global-data';
import type { NextPage } from 'next';
import { withGlobalData } from '@atb/layouts/global-data';
import { useRouter } from 'next/router';
import DeparturesLayout, {
  DeparturesLayoutProps,
} from '@atb/page-modules/departures/layout';

function DeparturesIdContent() {
  const router = useRouter();

  return <h3>{router.query.id}</h3>;
}

export type DeparturesPageProps = WithGlobalData<DeparturesLayoutProps>;
const DeparturesIdPage: NextPage<DeparturesPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <DeparturesLayout {...props}>
        <DeparturesIdContent />
      </DeparturesLayout>
    </DefaultLayout>
  );
};

export default DeparturesIdPage;

export const getServerSideProps = withGlobalData<DeparturesLayoutProps>();
