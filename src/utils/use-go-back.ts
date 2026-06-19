import { useRouter } from 'next/router';

export function useGoBack() {
  const router = useRouter();
  return () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push('/');
    }
  };
}
