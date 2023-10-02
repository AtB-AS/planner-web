import DefaultLayout from '@atb/layouts/default';
import type { WithGlobalData } from '@atb/layouts/global-data';
import type { NextPage } from 'next';
import DeparturesLayout, {
  DeparturesLayoutProps,
} from '@atb/layouts/departures';
import { withGlobalData } from '@atb/layouts/global-data';
import { useRouter } from 'next/router';

function DeparturesIdContent() {
  const router = useRouter();

  console.log(router);
  return <h1>{router.query.id}</h1>;
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
