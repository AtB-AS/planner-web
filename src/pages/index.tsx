import DefaultLayout from '@atb/layouts/default';
import { WithGlobalData, withGlobalData } from '@atb/layouts/global-data';
import { CommonText, useTranslation } from '@atb/translations';
import type { NextPage } from 'next';

function IndexContent() {
  const { t } = useTranslation();
  return <h1>{t(CommonText.Titles.siteTitle)}</h1>;
}

type IndexProps = WithGlobalData<{}>;
const Index: NextPage<IndexProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <IndexContent />
    </DefaultLayout>
  );
};

export default Index;

export const getServerSideProps = withGlobalData();
