import DefaultLayout from '@atb/layouts/default';
import { WithGlobalData, withGlobalData } from '@atb/layouts/global-data';
import { ErrorContent, ErrorContentProps } from '@atb/page-modules/error';
import { NextPage, NextPageContext } from 'next';

type ErrorPageProps = WithGlobalData<ErrorContentProps>;

const ErrorPage: NextPage<ErrorPageProps> = (props) => {
  return (
    <DefaultLayout {...props}>
      <ErrorContent {...props} />
    </DefaultLayout>
  );
};

export default ErrorPage;

export const getServerSideProps = withGlobalData(async function (context) {
  const ctx = context as any as NextPageContext;
  const statusCode = ctx.res
    ? ctx.res.statusCode
    : ctx.err
    ? ctx.err.statusCode
    : 404;
  const message = ctx.res
    ? ctx.res.statusMessage
    : ctx.err
    ? ctx.err.message
    : '';

  return { props: { statusCode, message: message ?? null } };
});
